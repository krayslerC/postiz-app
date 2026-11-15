#!/bin/sh
# Swipe Purge: carrega as chaves das redes do admin e sobe o Postiz como o original.
eval "$(node /swipe/buscar-chaves.mjs)"
exec docker-entrypoint.sh sh -c 'nginx && pnpm run pm2'
