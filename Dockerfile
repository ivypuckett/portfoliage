# --- Build stage: render the site with Eleventy into /app/_site ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# --- Serve stage: tiny (~4MB) static file server ---
# Keeps the Fly Machine bootable so the proxy-level [[statics]] fast-path in
# fly.toml has a process to sit in front of. Serves files from /srv/http.
FROM pierrezemb/gostatic

# The Eleventy build output (HTML + Markdown twins + llms.txt) is the web root.
COPY --from=build /app/_site/ /srv/http/
