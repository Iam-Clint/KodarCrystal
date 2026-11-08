import { z } from "zod";

export const userSchema = z.object({ id: z.string().uuid(), email: z.string().email(), name: z.string(), avatarUrl: z.string().url().nullable(), emailVerified: z.boolean() });
export const sessionSchema = z.object({ user: userSchema.nullable() });
export const projectSchema = z.object({
  id: z.string().uuid(), workspaceId: z.string().uuid(), name: z.string(), description: z.string(),
  appType: z.string(), visibility: z.enum(["private", "public"]), status: z.enum(["draft", "building", "ready", "failed"]),
  createdAt: z.string().datetime(), updatedAt: z.string().datetime(),
});
export const projectListSchema = z.object({ items: z.array(projectSchema), nextCursor: z.string().nullable() });
export const createProjectSchema = projectSchema.pick({ workspaceId: true, name: true, description: true, appType: true, visibility: true }).extend({ name: z.string().trim().min(1).max(120), prompt: z.string().trim().min(1).max(20_000) });
export const buildSchema = z.object({ id: z.string().uuid(), projectId: z.string().uuid(), status: z.enum(["queued", "running", "succeeded", "failed", "cancelled"]), creditsUsed: z.number().int().nonnegative(), previewUrl: z.string().url().nullable(), error: z.string().nullable() });
export const buildInputSchema = z.object({ prompt: z.string().trim().min(1).max(20_000), effort: z.enum(["low", "medium", "high", "max"]), mode: z.enum(["plan", "build"]), maxCredits: z.number().int().nonnegative() });
export const usageSchema = z.object({ creditsRemaining: z.number().int().nonnegative(), creditsUsed: z.number().int().nonnegative(), periodStart: z.string().datetime(), periodEnd: z.string().datetime() });
export const healthSchema = z.object({ status: z.literal("ok"), version: z.string() });
export type User = z.infer<typeof userSchema>;
export type BackendProject = z.infer<typeof projectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type BuildInput = z.infer<typeof buildInputSchema>;
