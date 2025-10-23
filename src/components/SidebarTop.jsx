// src/components/SidebarTop.jsx
import React from "react";

/**
 * Wrapper superior del sidebar.
 * En Tow no hace nada especial; solo mantiene la estructura
 * para que Sidebar.jsx compile y el layout sea consistente.
 */
export default function SidebarTop({ children }) {
  return <div className="sidebar__top">{children}</div>;
}
