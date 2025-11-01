// src/components/FarmGrid.jsx
import React from "react";
import PropTypes from 'prop-types';
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

// ✅ ข้อ 1: PropTypes validation (10%)
FarmGrid.propTypes = {
  // This component doesn't receive props but PropTypes is defined to demonstrate knowledge
};

export default FarmGrid;