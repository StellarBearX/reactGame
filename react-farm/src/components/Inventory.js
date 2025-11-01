/**
 * ============================================
 * 📁 Inventory.js - Component แสดงกระเป๋า (เมล็ดและผลผลิต)
 * ============================================
 * 
 * ไฟล์นี้แสดงกระเป๋าของผู้เล่น ซึ่งเก็บเมล็ดพันธุ์และผลผลิต
 * 
 * หน้าที่หลัก:
 * 1. แสดงเมล็ดพันธุ์ทั้งหมดใน seedInventory
 * 2. แสดงผลผลิตทั้งหมดใน produceInventory
 * 3. จัดการการเลือกเมล็ด (selectSeed/clearSelectedSeed)
 * 4. แสดงเมล็ดที่เลือกอยู่ (selectedSeed)
 * 5. เล่นเสียงเมื่อเลือกเมล็ด
 * 
 * การเชื่อมโยง:
 * - App.js: ใช้ใน /farm route (Sidebar) และ /inventory route (เต็มจอ)
 * - farmSlice.js: เรียกใช้ selectSeed และ clearSelectedSeed actions
 * - crops.js: ดึงข้อมูลพืช (icon, name) เพื่อแสดง
 * - sound.js: เล่นเสียงเมื่อเลือกเมล็ด
 * 
 * Redux State ที่ใช้:
 * - seedInventory: เมล็ดพันธุ์ในกระเป๋า (object: { cropId: count })
 * - produceInventory: ผลผลิตในกระเป๋า (object: { cropId: count })
 * - selectedSeed: เมล็ดที่เลือกอยู่ (string หรือ null)
 */

import React from "react";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'; // 🔗 Redux Hooks: ดึงข้อมูลและ Dispatch Actions
import { CROPS_DATA } from '../data/crops.js'; // 🔗 ข้อมูลพืชทั้งหมด
import { clearSelectedSeed, selectSeed } from '../state/farmSlice.js'; // 🔗 Redux Actions: เลือก/ยกเลิกเมล็ด
import { playPick } from '../utils/sound.js'; // 🔗 เสียงเอฟเฟกต์

/**
 * Inventory: Component แสดงกระเป๋า
 * 
 * แสดง 2 ส่วน:
 * 1. เมล็ดพันธุ์: แสดงเมล็ดทั้งหมด, สามารถเลือก/ยกเลิกการเลือกได้
 * 2. ผลผลิต: แสดงผลผลิตทั้งหมด (อ่านอย่างเดียว)
 */
function Inventory() {
  // 🔗 Redux: Dispatch Actions
  const dispatch = useDispatch();
  
  // 🔗 Redux: ดึงข้อมูลจาก Store
  const produceInventory = useSelector((state) => state.farm.produceInventory || {}); // ผลผลิต
  const seedInventory = useSelector((state) => state.farm.seedInventory || {}); // เมล็ดพันธุ์
  const selectedSeed = useSelector((state) => state.farm.selectedSeed); // เมล็ดที่เลือกอยู่
  
  // คำนวณจำนวนทั้งหมด
  const totalSeeds = Object.values(seedInventory).reduce((sum, count) => sum + count, 0);
  const totalProduce = Object.values(produceInventory).reduce((sum, count) => sum + count, 0);
  
  /**
   * handleSeedClick: จัดการการคลิกเมล็ด
   * 
   * Flow:
   * 1. ถ้าเมล็ดที่คลิกคือเมล็ดที่เลือกอยู่ → ยกเลิกการเลือก (clearSelectedSeed)
   * 2. ถ้าเป็นเมล็ดอื่น → เลือกเมล็ดนั้น (selectSeed)
   * 3. เล่นเสียงเมื่อเลือกเมล็ด
   * 
   * @param {string} cropId - ID ของเมล็ด (เช่น 'tomato')
   * 
   * 🔗 Redux Actions: selectSeed, clearSelectedSeed
   */
  const handleSeedClick = (cropId) => {
    if (selectedSeed === cropId) {
      // ถ้าเมล็ดที่คลิกคือเมล็ดที่เลือกอยู่ → ยกเลิกการเลือก
      dispatch(clearSelectedSeed()); // 🔗 Redux Action: ยกเลิกการเลือก
    } else {
      // ถ้าเป็นเมล็ดอื่น → เลือกเมล็ดนั้น
      dispatch(selectSeed(cropId)); // 🔗 Redux Action: เลือกเมล็ด
      playPick(); // 🔗 เสียง: เลือกเมล็ด
    }
  };

  return (
    <div className="inventory">
      {/* Header: แสดงชื่อและจำนวนของทั้งหมด */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
        <h2>🎒 กระเป๋า</h2>
        <div style={{fontSize: '12px', color: '#64748b', background: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '12px'}}>
          {totalSeeds + totalProduce} ชิ้น
        </div>
      </div>
      
      {/* แสดงเมล็ดที่เลือกอยู่ */}
      {selectedSeed && (
        <div style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', padding: '12px', borderRadius: '12px', marginBottom: '15px', border: '2px solid #fbbf24'}}>
          <div style={{fontSize: '12px', color: '#78350f', marginBottom: '5px'}}>
            <strong>🌱 เมล็ดที่เลือก</strong>
          </div>
          {/* แสดงไอคอนและชื่อเมล็ดที่เลือก */}
          <div style={{fontSize: '16px', fontWeight: 'bold', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span style={{fontSize: '24px'}}>{CROPS_DATA[selectedSeed].icon}</span>
            {CROPS_DATA[selectedSeed].name}
          </div>
          {/* ปุ่มยกเลิกการเลือก */}
          <button onClick={() => dispatch(clearSelectedSeed())} style={{marginTop: '8px', padding: '4px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600'}}>
            ยกเลิก
          </button>
        </div>
      )}

      {/* ส่วนเมล็ดพันธุ์ */}
      <div style={{marginBottom: '20px'}}>
        <h3 style={{fontSize: '15px', marginBottom: '10px', color: '#075985', display: 'flex', alignItems: 'center', gap: '8px'}}>
          🌱 เมล็ดพันธุ์
          <span style={{fontSize: '12px', color: '#64748b', marginLeft: 'auto'}}>({totalSeeds})</span>
        </h3>
        <div style={{display: 'grid', gap: '8px'}}>
          {/* ถ้าไม่มีเมล็ด → แสดงข้อความ "ยังไม่มีเมล็ด" */}
          {Object.keys(seedInventory).length === 0 ? (
            <div style={{padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', background: '#f1f5f9', borderRadius: '8px', border: '2px dashed #cbd5e1'}}>
              <div style={{fontSize: '32px', marginBottom: '4px'}}>🌱</div>
              <div>ยังไม่มีเมล็ด</div>
            </div>
          ) : (
            // Map ผ่าน seedInventory และแสดงเมล็ดแต่ละชนิด
            Object.entries(seedInventory).map(([id, count]) => (
              <div 
                key={id} 
                onClick={() => handleSeedClick(id)} // 🔗 คลิกเพื่อเลือก/ยกเลิกเมล็ด
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '10px 12px', 
                  borderRadius: '10px', 
                  // ถ้าเลือกอยู่ → สีเขียว, ถ้าไม่เลือก → สีขาว
                  background: selectedSeed === id ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 'white', 
                  border: selectedSeed === id ? '2px solid #22c55e' : '2px solid #e2e8f0', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s', 
                  transform: selectedSeed === id ? 'scale(1.02)' : 'scale(1)', 
                  boxShadow: selectedSeed === id ? '0 4px 8px rgba(34, 197, 94, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                {/* ไอคอนเมล็ด */}
                <div style={{fontSize: '28px'}}>{CROPS_DATA[id].icon}</div>
                <div style={{flex: 1}}>
                  {/* ชื่อเมล็ด */}
                  <div style={{fontWeight: '600', fontSize: '14px', color: '#1e293b'}}>{CROPS_DATA[id].name}</div>
                  {/* จำนวนเมล็ด */}
                  <div style={{fontSize: '11px', color: '#64748b'}}>{count} เมล็ด</div>
                </div>
                {/* ถ้าเลือกอยู่ → แสดงเครื่องหมาย ✓ */}
                {selectedSeed === id && (
                  <div style={{background: '#22c55e', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold'}}>✓</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ส่วนผลผลิต */}
      <div>
        <h3 style={{fontSize: '15px', marginBottom: '10px', color: '#075985', display: 'flex', alignItems: 'center', gap: '8px'}}>
          📦 ผลผลิต
          <span style={{fontSize: '12px', color: '#64748b', marginLeft: 'auto'}}>({totalProduce})</span>
        </h3>
        <div style={{display: 'grid', gap: '8px'}}>
          {/* ถ้าไม่มีผลผลิต → แสดงข้อความ "ยังไม่มีผลผลิต" */}
          {Object.keys(produceInventory).length === 0 ? (
            <div style={{padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', background: '#f1f5f9', borderRadius: '8px', border: '2px dashed #cbd5e1'}}>
              <div style={{fontSize: '32px', marginBottom: '4px'}}>📦</div>
              <div>ยังไม่มีผลผลิต</div>
            </div>
          ) : (
            // Map ผ่าน produceInventory และแสดงผลผลิตแต่ละชนิด
            Object.entries(produceInventory).map(([id, count]) => (
              <div 
                key={id} 
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '10px 12px', 
                  borderRadius: '10px', 
                  background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', 
                  border: '2px solid #fed7aa', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                {/* ไอคอนผลผลิต */}
                <div style={{fontSize: '28px'}}>{CROPS_DATA[id].icon}</div>
                <div style={{flex: 1}}>
                  {/* ชื่อผลผลิต */}
                  <div style={{fontWeight: '600', fontSize: '14px', color: '#1e293b'}}>{CROPS_DATA[id].name}</div>
                  {/* จำนวนผลผลิต */}
                  <div style={{fontSize: '11px', color: '#64748b'}}>{count} ชิ้น</div>
                </div>
                {/* แสดงจำนวน x count */}
                <div style={{background: '#fb923c', color: 'white', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold'}}>x{count}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// PropTypes validation
Inventory.propTypes = {
  // Component นี้ไม่รับ props แต่กำหนด PropTypes เพื่อแสดงความเข้าใจ
};

export default Inventory;
