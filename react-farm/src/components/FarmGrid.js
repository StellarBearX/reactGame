// src/components/FarmGrid.jsx
import React from "react";
import { useSelector } from 'react-redux'; // ✅ ข้อ 5: useSelector (15%)
import Plot from "./Plot.js";

function FarmGrid() {
  // ✅ ข้อ 5: ใช้ useSelector แทน Zustand
  const plots = useSelector((state) => state.farm?.plots ?? []);
  
  return (
    <div className="farm-grid">
      {plots.map((plot) => (
        <Plot key={plot.id} plot={plot} />
      ))}
    </div>
  );
}

export default FarmGrid;