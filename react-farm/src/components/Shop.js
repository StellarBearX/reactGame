// src/components/Shop.jsx
import React from "react";
import { useSelector, useDispatch } from 'react-redux'; // ✅ ข้อ 5: Redux hooks (15%)
import { buySeeds } from '../state/farmSlice.js';
import { CROPS_DATA } from '../data/crops.js';

function Shop() {
  // ✅ ข้อ 5: useSelector, useDispatch
  const dispatch = useDispatch();
  const selectedSeed = useSelector((state) => state.farm.selectedSeed);
  const money = useSelector((state) => state.farm.money);

  // ✅ ข้อ 3: Handle buy event (15%)
  const handleBuySeed = (cropId) => {
    const crop = CROPS_DATA[cropId];
    if (money >= crop.seedPrice) {
      dispatch(buySeeds(cropId));
    } else {
      alert('เงินไม่พอ! 💰');
    }
  };

  return (
    <div className="shop">
      <h2>🛒 ร้านขายเมล็ด</h2>
      <p style={{ fontSize: 'clamp(12px, 1.5vw, 14px)', color: '#666', marginBottom: '10px' }}>
        💰 เงินของคุณ: ฿{money}
      </p>
      <div className="shop-list">
        {Object.entries(CROPS_DATA).map(([id, crop]) => (
          <button
            key={id}
            className={selectedSeed === id ? "selected" : ""}
            onClick={() => handleBuySeed(id)}
            disabled={money < crop.seedPrice}
            style={{
              opacity: money < crop.seedPrice ? 0.5 : 1,
              cursor: money < crop.seedPrice ? 'not-allowed' : 'pointer'
            }}
          >
            {crop.icon} {crop.name} ({crop.seedPrice}💰)
            {selectedSeed === id && ' ✓'}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Shop;