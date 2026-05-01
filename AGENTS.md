<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Editing this site

The primary editor of this site is **Iris**, who is non-technical. Default to the workflow described in `.cursor/rules/iris-workflow.mdc`:

- Almost all edits are JSON in `src/content/*.json`. Don't write components or styles unless explicitly asked.
- Image/video paths in JSON are relative to `public/` (a value of `/images/foo.jpg` resolves to `public/images/foo.jpg`).
- **Sanity has been removed.** Do not re-introduce it. Do not restore the deleted `sanity/`, `src/lib/sanity/`, or `scripts/migrate-content-to-sanity.mjs`.
- The cobe globe components have been removed. Do not restore them.
- Hosting: Vercel, auto-deploy from GitHub `main`. Pushing to `main` ships to `irisonthemove.nl` in ~2 minutes. Pushing any other branch creates a Vercel preview URL.
