#!/usr/bin/env bash
set -euo pipefail

# Build microfrontend
npm run build:mf

# Ensure docs/ exists
mkdir -p docs

# Copy build artifacts
cp -f dist/btr-tow.js docs/btr-tow.js
# Optional CSS if you externalize it in el bundle
if [ -f "dist/style.css" ]; then
  cp -f dist/style.css docs/style.css
else
  # quick minimal style (same as microfront/styles.css packed)
  cat > docs/style.css <<'CSS'
/* placeholder: puedes reemplazar por tu CSS generado */
.btr-tow__panel{position:relative;background:#0f0f0f;color:#f5f5f5;border-radius:16px;padding:12px}
.btr-tow__map{height:360px;border-radius:12px;overflow:hidden;margin-top:8px}
.btr-tow__form{display:grid;gap:8px}
.btr-tow__row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
label{font-size:12px;opacity:.8}
input{width:100%;padding:8px 10px;border-radius:10px;border:1px solid #2a2a2a;background:#151515;color:#fff}
button{appearance:none;border:none;background:#ffe34d;color:#111;font-weight:700;padding:10px 12px;border-radius:12px;cursor:pointer}
.small{font-size:12px;opacity:.85}
.breakdown{background:#131313;border:1px solid #252525;padding:10px;border-radius:10px}
CSS
fi

echo "✅ Artefactos preparados en docs/. Sube este repo al público (BeteranoMotors/tow) con GitHub Pages activado (main/docs)."
