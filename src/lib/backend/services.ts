import { z } from "zod";
import type { ApiClient } from "./client.ts";
import { buildInputSchema, buildSchema, createProjectSchema, healthSchema, projectListSchema, projectSchema, sessionSchema, usageSchema, type BuildInput, type CreateProjectInput } from "./contracts.ts";

const identifier = (id: string) => encodeURIComponent(z.string().uuid().parse(id));

/** Integration seam. Existing UI actions stay local until migrated explicitly. */
export function createBackendServices(api: ApiClient) {
  return {
    health: (signal?: AbortSignal) => api.request("/health", { schema: healthSchema, signal }),
    auth: {
      csrf: (signal?: AbortSignal) => api.request("/auth/csrf", { schema: z.object({ token: z.string().min(1) }), signal }),
      session: (signal?: AbortSignal) => api.request("/auth/session", { schema: sessionSchema, signal }),
      login: (input: { email: string; password: string; rememberMe: boolean }) => api.request("/auth/login", { method: "POST", json: input, schema: sessionSchema }),
      signup: (input: { email: string; name: string; password: string }) => api.request("/auth/signup", { method: "POST", json: input, schema: z.object({ verificationId: z.string().uuid() }) }),
      verify: (input: { verificationId: string; code: string }) => api.request("/auth/verify", { method: "POST", json: input, schema: sessionSchema }),
      resend: (verificationId: string) => api.request<void>("/auth/resend", { method: "POST", json: { verificationId } }),
      forgotPassword: (email: string) => api.request<void>("/auth/forgot-password", { method: "POST", json: { email } }),
      resetPassword: (input: { token: string; password: string }) => api.request<void>("/auth/reset-password", { method: "POST", json: input }),
      logout: () => api.request<void>("/auth/logout", { method: "POST" }),
    },
    projects: {
      list: (workspaceId: string, signal?: AbortSignal, cursor?: string) => api.request(`/projects?workspaceId=${identifier(workspaceId)}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`, { schema: projectListSchema, signal }),
      get: (id: string, signal?: AbortSignal) => api.request(`/projects/${identifier(id)}`, { schema: projectSchema, signal }),
      create: (input: CreateProjectInput, idempotencyKey: string) => api.request("/projects", { method: "POST", json: createProjectSchema.parse(input), schema: projectSchema, idempotencyKey }),
      update: (id: string, input: { name?: string; visibility?: "private" | "public" }) => api.request(`/projects/${identifier(id)}`, { method: "PATCH", json: input, schema: projectSchema }),
      duplicate: (id: string, idempotencyKey: string) => api.request(`/projects/${identifier(id)}/duplicate`, { method: "POST", schema: projectSchema, idempotencyKey }),
      remove: (id: string) => api.request<void>(`/projects/${identifier(id)}`, { method: "DELETE" }),
    },
    builds: {
      create: (projectId: string, input: BuildInput, idempotencyKey: string) => api.request(`/projects/${identifier(projectId)}/builds`, { method: "POST", json: buildInputSchema.parse(input), schema: buildSchema, idempotencyKey }),
      get: (buildId: string, signal?: AbortSignal) => api.request(`/builds/${identifier(buildId)}`, { schema: buildSchema, signal }),
      cancel: (buildId: string) => api.request(`/builds/${identifier(buildId)}/cancel`, { method: "POST", schema: buildSchema }),
    },
    usage: (workspaceId: string, signal?: AbortSignal) => api.request(`/usage?workspaceId=${identifier(workspaceId)}`, { schema: usageSchema, signal }),
  };
}
