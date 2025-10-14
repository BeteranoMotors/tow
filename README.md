# BETERANO Web Tow (microfrontend)

Microfrontend **beterano-web-tow** para las funciones de **Gruas**:
- **SOS en vivo** (tipo Uber): pedir una grúa cercana y hacer tracking.
- **Presupuesto por trayecto**: origen/destino, ruta en mapa y cálculo de precio.

Diseñado para funcionar de dos formas:
1) **App standalone (Vite + React)** para desarrollo local.
2) **Microfrontend embebible** en el app-shell (`beterano-web-map`) vía un bundle IIFE (`/dist/btr-tow.js`) que expone `window.BTR_Tow.mount()`/`unmount()`.

---

## Requisitos

- Node 18+
- Vite 5+

Opcional/Producción:
- Claves/SDK de Firebase (si usas tracking en tiempo real y matching del backend).
- Servicio de rutas (OSRM, GraphHopper o Google). En el ejemplo se usa OSRM público.

---

## Scripts

```bash
# Modo app standalone (para maqueta y pruebas locales)
npm run dev          # http://localhost:5173
npm run build:app    # build SPA en /dist/app

# Bundle microfrontend (IIFE) -> /dist/btr-tow.js
npm run build:mf

# Previsualizar dist (sirve /dist)
npm run preview
```

- El **bundle microfrontend** genera `dist/btr-tow.js` y `dist/style.css` que puedes cargar desde el app-shell.
- El **app build** genera `dist/app/**` (no requerido por el app-shell, solo para pruebas locales).

---

## Integración en el app-shell (beterano-web-map)

Carga diferida cuando el usuario pulsa el botón **Tow** del dock/header:
```html
<div id="tow-container"></div>
<script>
async function openTowQuote() {
  if (!window.BTR_Tow) {
    await import('/PATH/TO/dist/btr-tow.js'); // o <script src=".../btr-tow.js"></script>
  }
  window.BTR_Tow.mount({
    targetId: 'tow-container',
    view: 'quote', // 'quote' | 'sos'
    props: {
      osrmUrl: 'https://router.project-osrm.org/route/v1',
      currency: 'CHF'
    }
  });
}
function closeTow() {
  window.BTR_Tow && window.BTR_Tow.unmount();
}
</script>
```

> El app-shell **no se desmonta**. Solo montas/desmontas esta micro-app dentro de un contenedor (`#tow-container`).

---

## Configuración de Firebase (opcional)

El microfrontend leerá `window.__BTR_FIREBASE` si existe para inicializar Firebase:
```html
<script>
  window.__BTR_FIREBASE = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    appId: "...",
    messagingSenderId: "..."
  };
</script>
```
Si no está presente, las funciones de realtime quedarán como **stubs** (no rompen).

---

## Estructura

```
beterano-web-tow/
├─ README.md
├─ package.json
├─ index.html
├─ vite.app.config.js
├─ vite.microfront.config.js
├─ src/
│  ├─ main.jsx                     # entrada SPA (dev)
│  ├─ App.jsx                      # router simple para demo
│  ├─ microfront/
│  │  ├─ index.js                  # expone window.BTR_Tow (mount/unmount)
│  │  └─ styles.css
│  ├─ views/
│  │  ├─ QuoteView.jsx
│  │  └─ SOSView.jsx
│  ├─ components/
│  │  ├─ TowPriceBreakdown.jsx
│  │  └─ TowDriverCard.jsx
│  ├─ sdk/
│  │  ├─ index.js
│  │  ├─ routing.js                # LRM + OSRM; fallback haversine
│  │  ├─ pricing.js
│  │  └─ realtime.js               # stubs Firebase
│  ├─ firebase/
│  │  └─ init.js
│  └─ lib/
│     └─ haversine.js
└─ public/
   └─ favicon.ico (opcional)
```

---

## Notas de producción

- Considera **hostear tu OSRM** para fiabilidad y límites.
- Añade control de permisos de geolocalización y toasts de error.
- Para conductor, crearás luego una PWA que comparta el SDK (`sdk/*`).

---

## Licencia
MIT (ajusta según tus necesidades)


---

## Flujo de repos privado/público

- Desarrollo en **privado**: `BeteranoCode/beterano-web-tow` (este repo).
- Publicación estática en **público**: `BeteranoMotors/tow`
  - Activar **GitHub Pages** con fuente `main` y carpeta `/docs`.
  - Ejecutar desde el repo privado:
    ```bash
    ./devops/deploy_public.sh
    git add docs
    git commit -m "chore: publish tow microfrontend to docs/ for GH Pages"
    git push
    ```
  - Si usas **dos remotos** (origin=privado, public=github.com/BeteranoMotors/tow.git):
    ```bash
    git remote add public https://github.com/BeteranoMotors/tow.git
    git push public main
    ```

> El app-shell (`beterano-web-map`) puede consumir directamente `https://beteranomotors.github.io/tow/btr-tow.js` y montar la app con `window.BTR_Tow.mount(...)`.
