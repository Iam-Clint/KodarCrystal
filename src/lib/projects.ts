import { useSyncExternalStore } from "react";
import { recentProjects } from "./mock-data.ts";
import { readStorage, writeStorage } from "./storage.ts";

export type LocalProject = { id: string; name: string; type: string; updated: string; color: string; folder?: string; prompt?: string };
const KEY = "kodarcrystal:projects";
const EVENT = "kodarcrystal:projects-change";
const seed: LocalProject[] = recentProjects.map(project => ({ ...project }));
let cached: LocalProject[] | undefined;

export function parseLocalProjects(value: string | null): LocalProject[] {
  if (value === null) return seed;
  try {
    const projects: unknown = JSON.parse(value);
    if (!Array.isArray(projects)) return seed;
    const ids = new Set<string>();
    for (const project of projects) {
      if (!project || typeof project !== "object" || !["id", "name", "type", "updated", "color"].every(key => typeof project[key] === "string") || !project.id.trim() || !project.name.trim() || ids.has(project.id)) return seed;
      if (["folder", "prompt"].some(key => project[key] !== undefined && typeof project[key] !== "string")) return seed;
      ids.add(project.id);
    }
    return projects;
  } catch {
    return seed;
  }
}

function getSnapshot() {
  if (typeof window === "undefined") return seed;
  return cached ??= parseLocalProjects(readStorage(KEY));
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) {
      cached = undefined;
      onChange();
    }
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function useLocalProjects() {
  return useSyncExternalStore(subscribe, getSnapshot, () => seed);
}

export function updateLocalProjects(update: (projects: LocalProject[]) => LocalProject[]) {
  if (typeof window === "undefined") return;
  cached = update(getSnapshot());
  writeStorage(KEY, JSON.stringify(cached));
  window.dispatchEvent(new Event(EVENT));
}

export function createLocalProject(input: Omit<LocalProject, "id" | "updated" | "color">) {
  const id = globalThis.crypto?.randomUUID?.() ?? `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const project: LocalProject = { ...input, id, updated: "Just now", color: "from-stone-500 to-zinc-800" };
  updateLocalProjects(projects => [...projects, project]);
  return project;
}

export function localProjectUrl(id: string) {
  const path = `/workspace?projectId=${encodeURIComponent(id)}`;
  return typeof window === "undefined" ? path : new URL(path, window.location.origin).href;
}
