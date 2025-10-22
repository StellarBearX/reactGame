import React from "react";
import useFarmStore from "../state/useFarmStore.js";

function Inventory() {
  const { inventory, getCropData } = useFarmStore();
  const crops = getCropData();

  return (
    <div className="inventory">
      <h2>📦 คลังผลผลิต</h2>
      <ul>
        {Object.keys(inventory).length === 0 ? (
          <li>ยังไม่มีผลผลิต</li>
        ) : (
          Object.entries(inventory).map(([id, count]) => (
            <li key={id}>
              {crops[id].name} × {count}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Inventory;
