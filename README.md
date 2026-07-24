# portfoliage

A static portfolio site served on [Fly.io](https://fly.io).

## Stack

- **Content:** plain HTML/CSS in [`public/`](./public) — edit `public/index.html`.
- **Server:** [`gostatic`](https://github.com/PierreZ/goStatic), a ~4MB static file server (see [`Dockerfile`](./Dockerfile)).
- **Edge:** Fly's proxy-level [`[[statics]]`](https://fly.io/docs/reference/configuration/#the-statics-sections) fast-path (see [`fly.toml`](./fly.toml)).
- **CI/CD:** auto-deploy on push to `main` via GitHub Actions ([`.github/workflows/fly-deploy.yml`](./.github/workflows/fly-deploy.yml)).

## One-time setup

Run these from the repo root (see the checklist your assistant provided for the parts already done):

```bash
# 1. Install flyctl and sign in
curl -L https://fly.io/install.sh | sh
fly auth login

# 2. Create the app (uses the name in fly.toml). Do NOT deploy yet.
fly launch --no-deploy --copy-config --name portfoliage

# 3. Create a deploy token and add it to GitHub as the FLY_API_TOKEN secret
fly tokens create deploy -x 999999h
# then: GitHub repo → Settings → Secrets and variables → Actions → New secret
#   Name: FLY_API_TOKEN   Value: <token from above>
```

## Deploying

- **Automatic:** push to `main` → GitHub Actions deploys.
- **Manual:** `fly deploy` from your machine, or run the workflow from the Actions tab.

## Custom domain (optional)

```bash
fly certs add www.yourdomain.com
```

Then add the DNS records Fly prints. Fly terminates TLS at its edge, so no cert config is needed in the container.
