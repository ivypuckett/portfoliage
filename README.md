# portfoliage

A static portfolio site that publishes every page **twice from one source**:

- **HTML** for humans and browsers — `/`, `/about/`, …
- **Markdown** for agents and LLMs — `/index.md`, `/about/index.md`, …
- plus a root **[`/llms.txt`](https://llmstxt.org)** index pointing agents at the Markdown.

Served on [Fly.io](https://fly.io).

## How it works

Markdown is the source of truth, and HTML is compiled from it. The repo is split
so that **one rule** decides what agents can read:

> If text lives in a file under [`content/`](./content), agents see it.
> If it doesn't, they don't.

| Directory | Role | Agent-visible? |
|---|---|---|
| [`content/*.md`](./content) | The canonical Markdown store — everything authored. | ✅ Served verbatim at `/<slug>.md`. |
| [`src/`](./src) | Pure machinery: the layout, the page compiler, the `llms.txt` template, data. | ❌ Never served as content. |

At build time [Eleventy](https://www.11ty.dev):

1. **Serves each `content/*.md` file untouched** (passthrough copy) at its `.md`
   URL — so what an agent fetches is *byte-for-byte the file you edit*.
2. **Compiles HTML from the same files** — [`src/_data/pages.js`](./src/_data/pages.js)
   parses each one; [`src/pages.11ty.js`](./src/pages.11ty.js) renders the
   Markdown into [`src/_includes/base.njk`](./src/_includes/base.njk).
3. **Generates [`/llms.txt`](https://llmstxt.org)** — a discovery index pointing
   agents at every `.md` URL (see [`src/llms.txt.njk`](./src/llms.txt.njk)).

Because the served Markdown *is* the source file (not a regenerated copy), the
human and agent views can't drift. Each HTML page also carries a
`<link rel="alternate" type="text/markdown" …>` pointing at its Markdown.

### Adding a page

Drop a Markdown file in `content/` with minimal front matter:

```markdown
---
title: About
description: A short summary for humans and agents.
---
Your content here. The first paragraph renders as the lead; a top-level
list renders as a row of link buttons.
```

`content/about.md` is served at `/about.md` and compiled to `/about/`. It's
picked up automatically — no wiring. (`order:` in front matter controls its
position in `llms.txt`.)

### Keeping something away from agents

Don't put it in `content/`. HTML-only chrome (the `🌿 Portfoliage` badge, the
footer) lives in the layout under `src/`, so it never reaches the Markdown or
`llms.txt`. Anything an agent shouldn't touch — interactive widgets, private
notes, presentational scaffolding — simply lives outside `content/`.

## Stack

- **Generator:** [Eleventy](https://www.11ty.dev) (`eleventy.config.js`) with [`markdown-it`](https://github.com/markdown-it/markdown-it) — `content/` Markdown → HTML + verbatim Markdown + `llms.txt`.
- **Server:** [`gostatic`](https://github.com/PierreZ/goStatic), a ~4MB static file server (see [`Dockerfile`](./Dockerfile)).
- **Edge:** Fly's proxy-level [`[[statics]]`](https://fly.io/docs/reference/configuration/#the-statics-sections) fast-path (see [`fly.toml`](./fly.toml)).
- **Deploys:** manual, via `fly deploy` (a multi-stage Docker build runs Eleventy, then copies `_site/` into the server image).

## Local development

```bash
npm install
npm run serve   # live-reloading dev server at http://localhost:8080
npm run build   # one-off build into ./_site
```

## One-time setup

```bash
# 1. Install flyctl and sign in
curl -L https://fly.io/install.sh | sh
fly auth login

# 2. Create the app (uses the name in fly.toml) and deploy.
fly launch --copy-config --name portfoliage
```

Add `--no-deploy` if you'd rather review before shipping, then run `fly deploy`.

## Deploying

Run `fly deploy` from the repo root. The Docker build renders the site with
Eleventy and copies the output into the `gostatic` image — no build artifacts
are committed to the repo.

## Custom domain (optional)

```bash
fly certs add www.yourdomain.com
```

Then add the DNS records Fly prints. Fly terminates TLS at its edge, so no cert
config is needed in the container. If you add a custom domain, update `url` in
[`src/_data/site.json`](./src/_data/site.json) so `llms.txt` emits absolute URLs
for the right host.
