import React from "react";
import useFarmStore from "../state/useFarmStore.js";
import Plot from "./Plot.js";

function FarmGrid() {
  const { plots } = useFarmStore();
  return (
    <div className="farm-grid">
      {plots.map((plot) => (
        <Plot key={plot.id} plot={plot} />
      ))}
    </div>
  );
}

export default FarmGrid;
