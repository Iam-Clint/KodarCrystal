import { useSyncExternalStore } from "react";
import { readStorage, writeStorage } from "./storage";

/** Demo session only. A backend must authorize every protected request. */
const KEY = "kodarcrystal:authed";
const SESSION_EVENT = "kodarcrystal:session-change";
let memorySession: boolean | undefined;

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return memorySession ?? (readStorage(KEY) === "1");
}

function updateSession(authenticated: boolean) {
  if (typeof window === "undefined") return;
  memorySession = authenticated;
  writeStorage(KEY, authenticated ? "1" : null);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function signIn() {
  updateSession(true);
}

export function signOut() {
  updateSession(false);
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) {
      memorySession = readStorage(KEY) === "1";
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(SESSION_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SESSION_EVENT, onChange);
  };
}

export function useAuth() {
  return useSyncExternalStore(subscribe, isAuthed, () => false);
}
