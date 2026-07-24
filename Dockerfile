# Tiny (~4MB) static file server. Keeps the Fly Machine bootable so the
# proxy-level [[statics]] fast-path in fly.toml has a process to sit in front of.
# Serves files from /srv/http on port 8043 by default.
FROM pierrezemb/gostatic

# Site content lives in ./public and is copied to the server's web root.
COPY public/ /srv/http/
