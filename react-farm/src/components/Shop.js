/**
 * ============================================
 * 📁 Shop.js - Component ร้านขายเมล็ดพันธุ์
 * ============================================
 * 
 * ไฟล์นี้แสดงร้านขายเมล็ดพันธุ์สำหรับซื้อเมล็ด
 * 
 * หน้าที่หลัก:
 * 1. แสดงเมล็ดพันธุ์ทั้งหมดที่ขายได้ (จาก CROPS_DATA)
 * 2. แสดงราคาเมล็ดแต่ละชนิด
 * 3. จัดการการซื้อเมล็ด (buySeeds action)
 * 4. แสดงเมล็ดที่เลือกอยู่ (selectedSeed)
 * 5. Disable ปุ่มถ้าเงินไม่พอ
 * 
 * การเชื่อมโยง:
 * - TabbedSidebar.js: ใช้ใน Tab 'shop'
 * - farmSlice.js: เรียกใช้ buySeeds action
 * - crops.js: ดึงข้อมูลพืชทั้งหมด (CROPS_DATA)
 * - Redux Store: ดึง money, selectedSeed
 * 
 * Flow การทำงาน:
 * 1. แสดงเมล็ดทั้งหมดจาก CROPS_DATA
 * 2. เมื่อคลิกเมล็ด → ตรวจสอบเงินพอหรือไม่
 * 3. ถ้าเงินพอ → dispatch buySeeds(cropId)
 * 4. ถ้าเงินไม่พอ → แสดง alert
 */

import React from "react";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'; // 🔗 Redux Hooks: ดึงข้อมูลและ Dispatch Actions
import { buySeeds } from '../state/farmSlice.js'; // 🔗 Redux Action: ซื้อเมล็ด
import { CROPS_DATA } from '../data/crops.js'; // 🔗 ข้อมูลพืชทั้งหมด

/**
 * Shop: Component ร้านขายเมล็ดพันธุ์
 * 
 * แสดงเมล็ดทั้งหมดที่ขายได้ และจัดการการซื้อ
 */
function Shop() {
  // 🔗 Redux: Dispatch Actions
  const dispatch = useDispatch();
  
  // 🔗 Redux: ดึงข้อมูลจาก Store
  const selectedSeed = useSelector((state) => state.farm.selectedSeed); // เมล็ดที่เลือกอยู่
  const money = useSelector((state) => state.farm.money); // เงิน

  /**
   * handleBuySeed: จัดการการซื้อเมล็ด
   * 
   * Flow:
   * 1. ดึงข้อมูลพืชจาก CROPS_DATA
   * 2. ตรวจสอบว่าเงินพอหรือไม่ (money >= crop.seedPrice)
   * 3. ถ้าเงินพอ → dispatch buySeeds(cropId)
   * 4. ถ้าเงินไม่พอ → แสดง alert
   * 
   * @param {string} cropId - ID ของเมล็ด (เช่น 'tomato')
   * 
   * 🔗 Redux Action: buySeeds
   */
  const handleBuySeed = (cropId) => {
    const crop = CROPS_DATA[cropId]; // 🔗 ดึงข้อมูลพืช
    
    if (money >= crop.seedPrice) {
      dispatch(buySeeds(cropId)); // 🔗 Redux Action: ซื้อเมล็ด
    } else {
      alert('เงินไม่พอ! 💰'); // แสดง alert ถ้าเงินไม่พอ
    }
  };

  return (
    <div className="shop">
      {/* Header: แสดงชื่อร้านและเงินที่มี */}
      <h2>🛒 ร้านขายเมล็ด</h2>
      <p style={{ fontSize: 'clamp(12px, 1.5vw, 14px)', color: '#666', marginBottom: '10px' }}>
        💰 เงินของคุณ: ฿{money}
      </p>
      
      {/* รายการเมล็ดที่ขาย */}
      <div className="shop-list">
        {/* Map ผ่าน CROPS_DATA และแสดงเมล็ดแต่ละชนิด */}
        {Object.entries(CROPS_DATA).map(([id, crop]) => (
          <button
            key={id}
            className={selectedSeed === id ? "selected" : ""} // CSS class: selected ถ้าเป็นเมล็ดที่เลือกอยู่
            onClick={() => handleBuySeed(id)} // 🔗 คลิกเพื่อซื้อเมล็ด
            disabled={money < crop.seedPrice} // Disable ถ้าเงินไม่พอ
            style={{
              opacity: money < crop.seedPrice ? 0.5 : 1, // ลดความทึบถ้าเงินไม่พอ
              cursor: money < crop.seedPrice ? 'not-allowed' : 'pointer' // เปลี่ยน cursor
            }}
          >
            {/* แสดงไอคอน, ชื่อ, ราคา */}
            {crop.icon} {crop.name} ({crop.seedPrice}💰)
            {/* แสดงเครื่องหมาย ✓ ถ้าเป็นเมล็ดที่เลือกอยู่ */}
            {selectedSeed === id && ' ✓'}
          </button>
        ))}
      </div>
    </div>
  );
}

// PropTypes validation
Shop.propTypes = {
  // Component นี้ไม่รับ props แต่กำหนด PropTypes เพื่อแสดงความเข้าใจ
};

export default Shop;
