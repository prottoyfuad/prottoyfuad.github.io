# prottoyfuad.com

Personal blog and portfolio site. No framework — a TypeScript build script generates plain HTML/CSS into `docs/`, which GitHub Pages serves directly from the `main` branch.

## Quick start

```bash
npm install
npm run build    # build → docs/
npm run debug    # build then serve locally at localhost:3000
```

## How it works

`npm run build` runs `src/build/build.ts` via `ts-node`. It reads templates, posts, and content files, fills in `{{PLACEHOLDER}}` values, and writes everything into `docs/`. Two small client scripts are bundled by esbuild into `docs/js/`. Nothing happens at request time — the output is purely static.

```
src/build/build.ts        ← orchestrates the whole pipeline
  ├── reads templates/    ← HTML files with {{PLACEHOLDER}} tokens
  ├── reads contents/     ← Markdown content (posts + about page)
  ├── reads assets/       ← copied as-is to docs/assets/
  ├── reads styles/       ← copied as-is to docs/styles/
  └── writes docs/        ← final output served by GitHub Pages
```

## Adding a post

Create a Markdown file in `contents/posts/`:

```markdown
---
id: my-post
title: My Post Title
date: 22122016
---

Post content here...
```

- `id` — becomes the URL slug: `/blogs/my-post/`
- `date` — format is `DDMMYYYY`
- `author` defaults to `siteConstants.author` if omitted

## Customizing the site

| What | Where |
|------|-------|
| Title, author, poem, domain, social links | `src/constants/site.ts` |
| About page bio | `contents/about.md` |
| Breadcrumb navigation tree | `src/constants/siteTree.ts` |
| Page templates | `templates/*.html` |
| Styles | `styles/*.css` (one file per page + `base.css`) |
| Welcome image / favicon | `assets/welcome.*` / `assets/favicon.*` (extension doesn't matter) |

---

Have fun!