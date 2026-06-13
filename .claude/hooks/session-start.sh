#!/bin/bash
# Installs dependencies so build/lint/tests work immediately in Claude Code on the web.
# Runs only in the remote (web) environment; local devs manage their own deps.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

# npm install (not ci) so the cached container layer is reused on later runs.
npm install --no-fund --no-audit
