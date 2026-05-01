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

### DNS
The domain `irisonthemove.nl` is registered at Mijndomein, but DNS points to Vercel:
- **A** record on `@` → `76.76.21.21`
- **CNAME** on `www` → `cname.vercel-dns.com`

### Notes
- AGENTS.md and `.cursor/rules/iris-workflow.mdc` exist so Cursor's AI agent assists Iris with edits + git in plain English.
- This is **Next.js 16** — APIs differ from older versions. Consult `node_modules/next/dist/docs/01-app/` before writing code (this is documented in `AGENTS.md`).
