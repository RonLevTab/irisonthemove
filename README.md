# Iris on the Move

Personal travel content site for **[irisonthemove.nl](https://irisonthemove.nl)** — Next.js 16 + Tailwind, deployed on Vercel.

## For Iris (the editor)

Open **[EDITING.md](./EDITING.md)** — it's a step-by-step in plain English for editing this site from your MacBook using Cursor.

## For developers

### Stack
- Next.js 16.2 (App Router) + React 19
- Tailwind CSS v4
- Framer Motion
- Formspree for the contact form
- Content stored as JSON in `src/content/*.json`
- Hosted on Vercel (auto-deploy from `main`)

### Local dev
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000). No env vars required.

### Build
```bash
npm run build
```

### Project layout
```
src/
  app/             — App Router routes (page.tsx, layout.tsx, etc.)
  components/      — UI components
  content/         — Site content (JSON files, edited by Iris via Cursor)
  lib/             — Helpers (content readers, fonts, theme, animations)
  types/           — Shared TypeScript types
public/            — Static assets (images, videos, fonts)
.cursor/rules/     — Cursor agent rules for the Iris workflow
```

### Deploys
- Push to `main` → Vercel deploys to production (`irisonthemove.nl`).
- Push to any other branch → Vercel creates a preview URL automatically.
- No env vars are needed in Vercel.


### Notes
- AGENTS.md and `.cursor/rules/iris-workflow.mdc` exist so Cursor's AI agent assists Iris with edits + git in plain English.
- This is **Next.js 16** — APIs differ from older versions. Consult `node_modules/next/dist/docs/01-app/` before writing code (this is documented in `AGENTS.md`).

### Website visit counter (My Work → Results)
The “Total website visits” number is **live**, not the static value in `work-page.json` (that file only sets the **starting count**, currently 51).

- Each real browser session on **irisonthemove.nl** adds one visit via `/api/visits`.
- **Production** needs a Vercel **KV** database connected to the project (Storage → Create KV → Connect). Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
- **Local dev** stores counts in `.data/website-visits.json` (gitignored) when KV is not configured.

Notification email is configured in Formspree for the project form ID in `src/content/site.json` (`formspreeId`), not inferred from `"email"` alone. Link and verify **`info@irisonthemove.nl`** under your Formspree account, then open that form → **Workflow** → **Email** (or **Form Settings** on legacy) and set the target address to **`info@irisonthemove.nl`**. Docs: [Changing a form email address](https://help.formspree.io/articles/form-and-project-settings/changing-a-form-email-address).

To point the site at a different Formspree form ID (without a code change), add **`NEXT_PUBLIC_FORMSPREE_FORM_ID`** in Vercel (Production + Preview): it overrides `site.json` at build time (`resolveFormspreeFormId` in `src/lib/siteContent.ts`).
