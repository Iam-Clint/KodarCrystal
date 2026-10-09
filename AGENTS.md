# Architecture rules
- Keep heavy Workspace and Community content in non-route modules loaded through module-scope React.lazy and Suspense; route configuration stays lightweight and retains TanStack automatic splitting.
- Expose MCP connections through a shared lazy wrapper so every consumer loads the same on-demand panel; type-only imports must not eagerly load the panel.
- Settings navigation uses the same tab definitions for a mobile Sheet, a tablet tooltip icon rail and a desktop labeled sidebar to keep navigation consistent.
- Appearance controls and navbar theme controls must use the root ThemeProvider as their sole theme state source to prevent divergent selections.
