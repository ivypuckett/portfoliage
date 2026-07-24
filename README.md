# portfoliage

A static portfolio site that publishes every page **twice from one source**:

- **HTML** for humans and browsers — `/`, `/about/`, …
- **Markdown** for agents and LLMs — `/index.md`, `/about/index.md`, …
- plus a root **[`/llms.txt`](https://llmstxt.org)** index pointing agents at the Markdown.

Served on [Fly.io](https://fly.io).

## How the dual output works

Content is authored once as Markdown in [`src/`](./src). At build time,
[Eleventy](https://www.11ty.dev) produces both representations:

| Output | Source | Notes |
|---|---|---|
| `…/index.html` | `src/*.md` + [`src/_includes/base.njk`](./src/_includes/base.njk) | Styled page for browsers. |
| `…/index.md` | [`src/md.njk`](./src/md.njk) | Raw Markdown twin, generated from each page's `rawInput`. |
| `/llms.txt` | [`src/llms.txt.njk`](./src/llms.txt.njk) | Discovery index of every page's Markdown URL. |

Because the Markdown twin is rebuilt from the same source file (via Eleventy 3's
`rawInput`), the HTML and Markdown can't drift. Each HTML page also carries a
`<link rel="alternate" type="text/markdown" …>` so agents can discover its twin.

### Adding a page

Drop a Markdown file in `src/` with front matter:

```markdown
---
layout: base.njk
title: About
description: A short summary for humans and agents.
tags: page
---
Your content here. The first paragraph renders as the lead; a top-level
list renders as a row of link buttons.
```

The `tags: page` line is what enrolls it in the Markdown-twin and `llms.txt`
generation. HTML-only chrome (the badge, the footer) lives in the layout, so it
stays out of the Markdown twin — that's the intended split for content that
shouldn't be mirrored to agents.

## Stack

- **Generator:** [Eleventy](https://www.11ty.dev) (`eleventy.config.js`), Markdown source → HTML + Markdown + `llms.txt`.
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
