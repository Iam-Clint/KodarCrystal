/**
 * Mock, frontend-only "session". No backend, no real auth — it just remembers
 * that the visitor pressed a login/signup button so gated pages can redirect.
 */
const KEY = "crystal:authed";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function signIn() {
  try {
    window.localStorage.setItem(KEY, "1");
  } catch {
    /* ignore */
  }
}

export function signOut() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
