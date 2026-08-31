#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "==> Pages & Leaves Bookstore — Install"

# 1. Create .env from example if absent
if [ ! -f .env ]; then
  cp .env.example .env
  # generate per-install secrets (auto-added by cenius)
  _cenius_gen() { openssl rand -hex 32 2>/dev/null || (head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n'); }
  for _k in SESSION_SECRET; do
    if grep -qiE "^${_k}=(<.*>|change[-_]?me.*|[[:space:]]*)$" .env 2>/dev/null; then
      sed -i "s|^${_k}=.*|${_k}=$(_cenius_gen)|" .env; fi
  done
  echo "    Created .env from .env.example"
fi

# 2. Generate SESSION_SECRET if missing or still empty
if ! grep -q '^SESSION_SECRET=' .env 2>/dev/null || grep -q '^SESSION_SECRET=$' .env 2>/dev/null; then
  SECRET=$(openssl rand -hex 32)
  if grep -q '^SESSION_SECRET=' .env 2>/dev/null; then
    sed -i "s/^SESSION_SECRET=.*/SESSION_SECRET=$SECRET/" .env
  else
    echo "SESSION_SECRET=$SECRET" >> .env
  fi
  echo "    Generated SESSION_SECRET"
fi

# 3. Install dependencies
npm install
echo "    Dependencies installed"

# 4. Create database and seed demo data
node seed.js
echo "    Database seeded"

echo ""
echo "==> Starting server..."
echo "    http://localhost:${PORT:-3000}"
echo ""

exec node app.js
