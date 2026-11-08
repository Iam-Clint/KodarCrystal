/** Public configuration only. VITE_* values are included in browser bundles. */
export function normalizeApiBaseUrl(value: string = "/api/v1"): string {
  const base = value.trim().replace(/\/+$/, "");
  if (/^\/(?!\/)/.test(base) && !/[?#\\]/.test(base) && !base.split("/").includes("..")) return base;
  try {
    const url = new URL(base);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if ((url.protocol === "https:" || (url.protocol === "http:" && local)) && !url.username && !url.password && !url.search && !url.hash) return base;
  } catch {
    // Report configuration failures before any request is sent.
  }
  throw new Error("API base URL must be a root-relative path or an HTTPS URL (HTTP is allowed on localhost).");
}

export function getApiBaseUrl() {
  return normalizeApiBaseUrl(import.meta.env?.VITE_API_BASE_URL || "/api/v1");
}
