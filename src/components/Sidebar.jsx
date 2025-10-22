// beterano-web-tow/src/components/Sidebar.jsx
import React, { useState } from "react";
import SidebarTop from "./SidebarTop.jsx"; // o "./SidebarTop"

export default function SidebarTow() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState(null);

  const calc = () => {
    // placeholder: aquí llamarías a tu servicio de rutas / matriz, etc.
    if (!from || !to) {
      setResult("Introduce origen y destino.");
      return;
    }
    setResult(`Calculando ruta de ${from} a ${to}…`);
  };

  return (
    <div className="sidebar__inner">
      {/* Dock arriba */}
      <SidebarTop />

      {/* Panel de TOW */}
      <div className="sidebar__panel">
        <div className="sidebar__header" style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
          <input
            className="sidebar-search"
            placeholder="Origen (lat,lng o dirección)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            className="sidebar-search"
            placeholder="Destino (lat,lng o dirección)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <button className="btn btn--filter" onClick={calc}>Calcular</button>
        </div>
        {result && <div style={{ marginTop: 8 }}>{result}</div>}
      </div>

      {/* Si Tow necesita lista/tabla de resultados, colócala aquí */}
      <div className="sidebar__content">
        {/* … */}
      </div>
    </div>
  );
}
