## What this repo is

- Minimal React + TypeScript app bootstrapped for Vite.
- Entry point: `src/main.tsx` -> mounts `App` (`src/App.tsx`).
- Bundler: Vite (note: package.json overrides `vite` to the `rolldown-vite` package alias).

## Big-picture architecture (quick)

- Single-page client-side React app. No backend code in this repo.
- TypeScript is used with project references: `tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`.
- The app relies on Vite dev server for HMR and the `@vitejs/plugin-react` plugin (see `vite.config.ts`).

## Key workflows (commands you can run)

- Start dev server (HMR):
  - `npm run dev` (runs `vite`) — edit `src/*.tsx` and Vite will hot-reload.
- Build for production:
  - `npm run build` runs `tsc -b && vite build`.
    - Important: `tsc -b` runs a TypeScript project build (type checking) before the Vite build.
    - Do not skip `tsc -b` in CI unless you explicitly accept missing type-checks.
- Preview production build:
  - `npm run preview` (runs `vite preview`).
- Linting:
  - `npm run lint` (runs `eslint .`). See `eslint.config.js` for the configured rule sets (typescript-eslint, react-hooks, react-refresh plugin).

## Project-specific patterns & gotchas for an AI assistant

- Explicit file extensions in imports: the codebase uses imports with extensions (e.g., `import App from './App.tsx'` in `src/main.tsx`). Respect the project's style — preserve extensions when adding files or imports.
- TS Configs:
  - `tsconfig.app.json` is the app config (include `src`). It sets `noEmit: true` (the project uses `tsc -b` for checking).
  - `tsconfig.node.json` includes `vite.config.ts` for node-only typing.
- Vite alias/override: `package.json` uses an npm alias override so `vite` resolves to `rolldown-vite@7.1.14`. This can change plugin behavior or build outputs compared to plain Vite. When editing `vite.config.ts`, be conservative and test `npm run dev` and `npm run build` locally.
- Assets:
  - `index.html` references `/vite.svg` and `src/App.tsx` uses `/vite.svg` and `./assets/react.svg`. Use Vite conventions for absolute (`/vite.svg`) and relative imports for static assets.

## Files to inspect for area-specific changes

- `package.json` — scripts, dependencies, and the vite override.
- `vite.config.ts` — dev/build plugin configuration (`@vitejs/plugin-react`).
- `tsconfig.app.json` & `tsconfig.node.json` — TypeScript settings and strictness.
- `eslint.config.js` — lint rules and expectations.
- `src/main.tsx`, `src/App.tsx` — entry & main UI component patterns.
- `index.html` — root HTML and script mount.

## Recommended behavior for edits & PRs

- Keep import file extensions when adding or moving files (match existing imports).
- Run the local dev server and the build locally when making changes that touch configuration or TypeScript types:
  - `npm run dev` (fast feedback for UI changes)
  - `npm run build` (verifies tsc type-check + Vite production build)
- If adding new package dependencies, update `package.json` and keep `devDependencies` vs `dependencies` aligned with use (runtime vs tooling).

## Example tasks and where to look

- Add a new page-level component: create `src/pages/Foo.tsx`, export default, and import it with extension from wherever you use it. Update routes (if you add routing) — there is no router currently.
- Add a TypeScript utility: place in `src/lib/` or `src/utils/`, export named functions, and ensure types are strict (project is strict by default via tsconfig).

## Missing/unknowns (callouts for maintainers)

- There are no test scripts or test framework configured — unit/integration tests are not present.
- No CI config detected in repository root — verify CI conventions with the team if committing production changes.

---

## WebStackAssistant Profile

**Name:** WebStackAssistant  
**Description:** AI assistant for TypeScript + React + Tailwind + Supabase projects

### General Behavior

- Always write clean, modular, and readable code.
- Follow DRY (Don't Repeat Yourself) and component reusability principles.
- Keep responses concise unless deeper detail is requested.

### Project Consistency

- Maintain a consistent design pattern and theme across all components.
- Reuse existing component structure, prop naming conventions, and utility patterns.
- Follow the same file and folder naming conventions as previously used.
- If a component or style already exists that serves a similar function, suggest reusing or extending it.
- Keep color palette, spacing, and typography consistent with the Tailwind theme defined in `tailwind.config.js`.
- Use shared constants, hooks, or context if present (e.g., theme, auth, API clients).

### Framework-Specific Guidelines

- **TypeScript**: use strict typing and interfaces; no `any` unless unavoidable.
- **React**: use function components, hooks, and compositional patterns.
- **Tailwind**: use utility classes efficiently; no inline styles unless necessary.
- **Supabase**: prefer async/await with proper error handling and explicit type definitions for returned data.

### Documentation and References

Prefer the following official documentation when providing examples or syntax:

- TypeScript: https://www.typescriptlang.org/docs/
- React: https://react.dev/reference
- Tailwind CSS: https://tailwindcss.com/docs
- Supabase: https://supabase.com/docs

### PowerShell Commands

When writing terminal commands, combine them into a single PowerShell line using `;` or `&`.

Example:

```powershell
cd my-app; npm run dev
```

### Style of Explanations

- Keep comments minimal and purposeful.
- Explain reasoning only when code structure or design choices are non-obvious.

---

If anything here is unclear or you'd like more examples (code snippets for common changes, tests, or CI steps), tell me what area to expand and I'll update this file.
