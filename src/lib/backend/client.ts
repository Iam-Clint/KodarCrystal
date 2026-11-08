import type { ZodType } from "zod";
import { normalizeApiBaseUrl } from "./config.ts";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;
  readonly requestId?: string;

  constructor(message: string, status: number, code: string, details?: unknown, requestId?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

type RequestOptions<T> = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  json?: unknown;
  signal?: AbortSignal;
  schema?: ZodType<T>;
  idempotencyKey?: string;
};

export function createApiClient(options: {
  baseUrl: string;
  fetch?: typeof globalThis.fetch;
  timeoutMs?: number;
  getCsrfToken?: () => string | undefined;
}) {
  const baseUrl = normalizeApiBaseUrl(options.baseUrl);
  const fetcher = options.fetch ?? globalThis.fetch.bind(globalThis);

  return {
    async request<T = unknown>(path: string, request: RequestOptions<T> = {}): Promise<T> {
      const decodedPath = decodeURIComponent(path.split("?")[0]);
      if (!/^\/(?!\/)/.test(path) || /[\\#]/.test(path) || /(?:^|\/)(?:\.|\.\.)(?:\/|\?|$)/.test(decodedPath)) {
        throw new Error("API endpoints must stay within the configured API prefix.");
      }
      const controller = new AbortController();
      let timedOut = false;
      const abort = () => controller.abort(request.signal?.reason);
      if (request.signal?.aborted) abort();
      else request.signal?.addEventListener("abort", abort, { once: true });
      const timeout = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, options.timeoutMs ?? 30_000);
      const method = request.method ?? "GET";
      const headers = new Headers({ Accept: "application/json" });
      if (request.json !== undefined) headers.set("Content-Type", "application/json");
      if (request.idempotencyKey) headers.set("Idempotency-Key", request.idempotencyKey);
      const csrf = options.getCsrfToken?.();
      if (method !== "GET" && csrf) headers.set("X-CSRF-Token", csrf);

      try {
        const response = await fetcher(`${baseUrl}${path}`, {
          method,
          headers,
          credentials: "include",
          signal: controller.signal,
          body: request.json === undefined ? undefined : JSON.stringify(request.json),
        });
        if (response.status === 204 && response.ok) return undefined as T;
        const body = await response.text();
        let payload: unknown;
        try {
          payload = JSON.parse(body);
        } catch {
          throw new ApiError(response.ok ? "The API returned invalid JSON." : `Request failed (${response.status}).`, response.status, "INVALID_RESPONSE");
        }
        const envelope = payload as { data?: unknown; error?: { message?: string; code?: string; details?: unknown }; requestId?: string } | null;
        if (!response.ok) {
          throw new ApiError(envelope?.error?.message || `Request failed (${response.status}).`, response.status, envelope?.error?.code || "REQUEST_FAILED", envelope?.error?.details, envelope?.requestId);
        }
        if (!envelope || typeof envelope !== "object" || !("data" in envelope)) {
          throw new ApiError("The API response is missing its data envelope.", response.status, "INVALID_RESPONSE");
        }
        if (request.schema) {
          const parsed = request.schema.safeParse(envelope.data);
          if (!parsed.success) throw new ApiError("The API response does not match the expected format.", response.status, "INVALID_RESPONSE", parsed.error.flatten());
          return parsed.data;
        }
        return envelope.data as T;
      } catch (error) {
        if (error instanceof ApiError) throw error;
        if (request.signal?.aborted) throw error;
        if (timedOut) throw new ApiError("The request timed out. Please try again.", 0, "TIMEOUT");
        throw new ApiError("Could not reach the backend. Check your connection and API configuration.", 0, "NETWORK_ERROR");
      } finally {
        clearTimeout(timeout);
        request.signal?.removeEventListener("abort", abort);
      }
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
