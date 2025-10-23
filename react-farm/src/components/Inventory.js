// src/components/Inventory.jsx
import React from "react";
import { useSelector } from 'react-redux'; // ✅ ข้อ 5: useSelector (15%)
import { CROPS_DATA } from '../data/crops.js';

function Inventory() {
  // ✅ ข้อ 5: ใช้ useSelector
  const produceInventory = useSelector((state) => state.farm.produceInventory || {}); // ✅ เพิ่ม || {}
const seedInventory = useSelector((state) => state.farm.seedInventory || {}); // ✅ เพิ่ม || {}
const selectedSeed = useSelector((state) => state.farm.selectedSeed);
  return (
    <div className="inventory">
      <h2>🎒 กระเป๋า</h2>
      
      {/* แสดงเมล็ดที่เลือกอยู่ */}
      {selectedSeed && (
        <div style={{ 
          background: '#fef3c7', 
          padding: '10px', 
          borderRadius: '8px', 
          marginBottom: '10px',
          border: '2px solid #fbbf24'
        }}>
          <strong>🌱 เมล็ดที่เลือก:</strong>
          <div style={{ marginTop: '5px' }}>
            {CROPS_DATA[selectedSeed].icon} {CROPS_DATA[selectedSeed].name}
          </div>
        </div>
      )}

      {/* แสดงเมล็ดในกระเป๋า */}
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>🌱 เมล็ดพันธุ์</h3>
        <ul>
          {Object.keys(seedInventory).length === 0 ? (
            <li style={{ color: '#999' }}>ยังไม่มีเมล็ด</li>
          ) : (
            Object.entries(seedInventory).map(([id, count]) => (
              <li key={id}>
                {CROPS_DATA[id].icon} {CROPS_DATA[id].name} × {count}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* แสดงผลผลิต */}
      <div>
        <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>📦 ผลผลิต</h3>
        <ul>
          {Object.keys(produceInventory).length === 0 ? (
            <li style={{ color: '#999' }}>ยังไม่มีผลผลิต</li>
          ) : (
            Object.entries(produceInventory).map(([id, count]) => (
              <li key={id}>
                {CROPS_DATA[id].icon} {CROPS_DATA[id].name} × {count}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Inventory;