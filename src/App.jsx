// src/App.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import QuoteView from "./views/QuoteView.jsx";
import SOSView from "./views/SOSView.jsx";

/**
 * props:
 * - view: 'quote' | 'sos'  (vista inicial al montar desde UMD)
 * - ...cualquier otra prop que quieras pasar a las vistas
 */
export default function App(props) {
  const [view, setView] = useState(props.view === "sos" ? "sos" : "quote");

  // (Opcional) escuchar acciones del dock para cambiar de vista
  useEffect(() => {
    const onDock = (e) => {
      const action = e?.detail?.action;
      if (action === "tow_quote") setView("quote");
      if (action === "tow_sos") setView("sos");
    };
    document.addEventListener("btr:dock", onDock);
    return () => document.removeEventListener("btr:dock", onDock);
  }, []);

  return (
    <div className="layout-container">
      {/* IZQ: sidebar (incluye dock en SidebarTop + panel propio Tow) */}
      <aside className="sidebar" role="complementary" aria-label="Barra lateral">
        <Sidebar />
      </aside>

      {/* DER: contenido principal Tow */}
      <main className="map-container" role="main" aria-label="Contenido principal">
        <div style={{ padding: 12, height: "100%", boxSizing: "border-box", overflow: "auto" }}>
          <header style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <h1 style={{ margin: 0, fontSize: 22, lineHeight: 1.2 }}>
              {view === "quote" ? "Calcular traslado" : "SOS en vivo"}
            </h1>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button onClick={() => setView("quote")}>Calcular traslado</button>
              <button onClick={() => setView("sos")}>SOS en vivo</button>
            </div>
          </header>

          {view === "quote" ? (
            <QuoteView {...props} />
          ) : (
            <SOSView {...props} />
          )}
        </div>
      </main>
    </div>
  );
}
