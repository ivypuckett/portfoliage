# portfoliage

A static portfolio site served on [Fly.io](https://fly.io).

## Stack

- **Content:** plain HTML/CSS in [`public/`](./public) — edit `public/index.html`.
- **Server:** [`gostatic`](https://github.com/PierreZ/goStatic), a ~4MB static file server (see [`Dockerfile`](./Dockerfile)).
- **Edge:** Fly's proxy-level [`[[statics]]`](https://fly.io/docs/reference/configuration/#the-statics-sections) fast-path (see [`fly.toml`](./fly.toml)).
- **Deploys:** manual, via `fly deploy`.

## One-time setup

Run these from the repo root (see the checklist your assistant provided for the parts already done):

```bash
# 1. Install flyctl and sign in
curl -L https://fly.io/install.sh | sh
fly auth login

# 2. Create the app (uses the name in fly.toml) and deploy.
fly launch --copy-config --name portfoliage
```

If you'd rather review before shipping, add `--no-deploy` above and run
`fly deploy` when ready.

## Deploying

Run `fly deploy` from the repo root whenever you want to publish changes.

## Custom domain (optional)

```bash
fly certs add www.yourdomain.com
```

Then add the DNS records Fly prints. Fly terminates TLS at its edge, so no cert config is needed in the container.
