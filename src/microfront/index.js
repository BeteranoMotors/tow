// src/microforont/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "../App.jsx";
import "./styles.css";

let _root = null;
let _container = null;

function doRender({ targetId = "tow-container", view = "quote", props = {} } = {}) {
  const el = document.getElementById(targetId);
  if (!el) return false;

  // Evita doble-montajes
  if (_root && _container === el) return true;

  _container = el;
  _root = createRoot(el);
  _root.render(<App view={view} {...props} />);
  return true;
}

/**
 * Monta la app Tow en el elemento indicado.
 * Si el target aún no existe (por orden de carga), reintenta brevemente.
 */
function mount({ targetId = "tow-container", view = "quote", props = {} } = {}) {
  // Si ya estaba montado en el mismo contenedor, rehúsa
  if (_root && _container && _container.id === targetId) return;

  if (doRender({ targetId, view, props })) return;

  // Reintentos cortos por si el DOM aún no está listo
  const startedAt = Date.now();
  const t = setInterval(() => {
    if (doRender({ targetId, view, props }) || Date.now() - startedAt > 8000) {
      clearInterval(t);
    }
  }, 50);

  // Montaje tras DOMContentLoaded como último recurso
  if (document.readyState !== "complete" && document.readyState !== "interactive") {
    const once = () => {
      doRender({ targetId, view, props });
      document.removeEventListener("DOMContentLoaded", once);
    };
    document.addEventListener("DOMContentLoaded", once);
  }
}

function unmount() {
  try {
    _root?.unmount();
  } catch (_) {}
  _root = null;
  _container = null;
}

export { mount, unmount };

// Exponer global si se carga vía <script> para index.html estático
if (typeof window !== "undefined") {
  window.BTR_Tow = window.BTR_Tow || {};
  window.BTR_Tow.mount = mount;
  window.BTR_Tow.unmount = unmount;
}
