// src/components/Inventory.jsx
import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { CROPS_DATA } from '../data/crops.js';
import { clearSelectedSeed, selectSeed } from '../state/farmSlice.js';

function Inventory() {
  const dispatch = useDispatch();
  const produceInventory = useSelector((state) => state.farm.produceInventory || {});
  const seedInventory = useSelector((state) => state.farm.seedInventory || {});
  const selectedSeed = useSelector((state) => state.farm.selectedSeed);
  
  const totalSeeds = Object.values(seedInventory).reduce((sum, count) => sum + count, 0);
  const totalProduce = Object.values(produceInventory).reduce((sum, count) => sum + count, 0);
  
  const handleSeedClick = (cropId) => {
    if (selectedSeed === cropId) {
      dispatch(clearSelectedSeed());
    } else {
      dispatch(selectSeed(cropId));
    }
  };

  return (
    <div className="inventory">
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
        <h2>🎒 กระเป๋า</h2>
        <div style={{fontSize: '12px', color: '#64748b', background: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '12px'}}>
          {totalSeeds + totalProduce} ชิ้น
        </div>
      </div>
      
      {selectedSeed && (
        <div style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', padding: '12px', borderRadius: '12px', marginBottom: '15px', border: '2px solid #fbbf24'}}>
          <div style={{fontSize: '12px', color: '#78350f', marginBottom: '5px'}}>
            <strong>🌱 เมล็ดที่เลือก</strong>
          </div>
          <div style={{fontSize: '16px', fontWeight: 'bold', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span style={{fontSize: '24px'}}>{CROPS_DATA[selectedSeed].icon}</span>
            {CROPS_DATA[selectedSeed].name}
          </div>
          <button onClick={() => dispatch(clearSelectedSeed())} style={{marginTop: '8px', padding: '4px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600'}}>
            ยกเลิก
          </button>
        </div>
      )}

      <div style={{marginBottom: '20px'}}>
        <h3 style={{fontSize: '15px', marginBottom: '10px', color: '#075985', display: 'flex', alignItems: 'center', gap: '8px'}}>
          🌱 เมล็ดพันธุ์
          <span style={{fontSize: '12px', color: '#64748b', marginLeft: 'auto'}}>({totalSeeds})</span>
        </h3>
        <div style={{display: 'grid', gap: '8px'}}>
          {Object.keys(seedInventory).length === 0 ? (
            <div style={{padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', background: '#f1f5f9', borderRadius: '8px', border: '2px dashed #cbd5e1'}}>
              <div style={{fontSize: '32px', marginBottom: '4px'}}>🌱</div>
              <div>ยังไม่มีเมล็ด</div>
            </div>
          ) : (
            Object.entries(seedInventory).map(([id, count]) => (
              <div key={id} onClick={() => handleSeedClick(id)} style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', background: selectedSeed === id ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 'white', border: selectedSeed === id ? '2px solid #22c55e' : '2px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', transform: selectedSeed === id ? 'scale(1.02)' : 'scale(1)', boxShadow: selectedSeed === id ? '0 4px 8px rgba(34, 197, 94, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)'}}>
                <div style={{fontSize: '28px'}}>{CROPS_DATA[id].icon}</div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: '600', fontSize: '14px', color: '#1e293b'}}>{CROPS_DATA[id].name}</div>
                  <div style={{fontSize: '11px', color: '#64748b'}}>{count} เมล็ด</div>
                </div>
                {selectedSeed === id && (
                  <div style={{background: '#22c55e', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold'}}>✓</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 style={{fontSize: '15px', marginBottom: '10px', color: '#075985', display: 'flex', alignItems: 'center', gap: '8px'}}>
          📦 ผลผลิต
          <span style={{fontSize: '12px', color: '#64748b', marginLeft: 'auto'}}>({totalProduce})</span>
        </h3>
        <div style={{display: 'grid', gap: '8px'}}>
          {Object.keys(produceInventory).length === 0 ? (
            <div style={{padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', background: '#f1f5f9', borderRadius: '8px', border: '2px dashed #cbd5e1'}}>
              <div style={{fontSize: '32px', marginBottom: '4px'}}>📦</div>
              <div>ยังไม่มีผลผลิต</div>
            </div>
          ) : (
            Object.entries(produceInventory).map(([id, count]) => (
              <div key={id} style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '2px solid #fed7aa', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
                <div style={{fontSize: '28px'}}>{CROPS_DATA[id].icon}</div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: '600', fontSize: '14px', color: '#1e293b'}}>{CROPS_DATA[id].name}</div>
                  <div style={{fontSize: '11px', color: '#64748b'}}>{count} ชิ้น</div>
                </div>
                <div style={{background: '#fb923c', color: 'white', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold'}}>x{count}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Inventory;

