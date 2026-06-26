# Static export — deploy to Vercel

This folder is a self-contained static build of the site.

## Deploy
1. Push this folder to a Git repo (or drag-and-drop in the Vercel dashboard).
2. In Vercel, create a new project from the repo.
3. **Framework Preset:** Other
4. **Build Command:** *(leave empty)*
5. **Output Directory:** `.` (this folder is already the output)
6. Deploy.

`vercel.json` enables clean URLs (e.g. `/about` instead of `/about.html`)
and a custom `404.html` is served on unknown routes.

## Structure
- `index.html`, `about.html`, `services.html`, `portfolio.html`, `contact.html`, `404.html` — pages
- `assets/app.css` — compiled Tailwind + design tokens
- `assets/animations.js` — anime.js scroll / hero / dot-grid / magnet / cursor animations
- `assets/site.js` — theme toggle + mobile menu
- `images/`, `projects/` — site imagery
