import React from "react";
import useFarmStore from "../state/useFarmStore.js";

function Shop() {
  const { getCropData, buySeeds, selectedSeed } = useFarmStore();
  const crops = getCropData();

  return (
    <div className="shop">
      <h2>🛒 ร้านขายเมล็ด</h2>
      <div className="shop-list">
        {Object.entries(crops).map(([id, crop]) => (
          <button
            key={id}
            className={selectedSeed === id ? "selected" : ""}
            onClick={() => buySeeds(id)}
          >
            {crop.name} ({crop.seedPrice}💰)
          </button>
        ))}
      </div>
    </div>
  );
}

export default Shop;
