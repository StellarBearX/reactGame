/**
 * ============================================
 * 📁 FarmGrid.js - Component แสดงแปลงปลูกทั้งหมด
 * ============================================
 * 
 * ไฟล์นี้แสดงแปลงปลูกทั้งหมดในรูปแบบ Grid
 * 
 * หน้าที่หลัก:
 * 1. ดึงข้อมูล plots จาก Redux Store
 * 2. Render Plot Component สำหรับแต่ละแปลง
 * 
 * การเชื่อมโยง:
 * - Plot.js: Component ที่แสดงแต่ละแปลงปลูก
 * - Redux Store: ดึงข้อมูล plots จาก state.farm.plots
 * - App.js: ใช้ใน /farm route
 * 
 * Flow การทำงาน:
 * 1. ใช้ useSelector ดึง plots จาก Redux Store
 * 2. Map ผ่าน plots array
 * 3. Render Plot Component สำหรับแต่ละแปลง
 */

import React from "react";
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'; // 🔗 Redux Hook: ดึงข้อมูลจาก Store
import Plot from "./Plot.js"; // 🔗 Component: แสดงแต่ละแปลงปลูก

/**
 * FarmGrid: Component หลักสำหรับแสดงแปลงปลูกทั้งหมด
 * 
 * ใช้ Redux useSelector เพื่อดึงข้อมูล plots จาก Store
 * แล้ว render Plot Component สำหรับแต่ละแปลง
 */
function FarmGrid() {
  // 🔗 Redux: ดึงข้อมูล plots จาก Store
  // state.farm.plots → Array of plot objects [{ id, crop, plantedAt, isGrown }, ...]
  const plots = useSelector((state) => state.farm?.plots ?? []);
  
  return (
    <div className="farm-grid">
      {/* Map ผ่าน plots และ render Plot Component สำหรับแต่ละแปลง */}
      {plots.map((plot) => (
        <Plot key={plot.id} plot={plot} /> // 🔗 Plot Component: แสดงแปลงปลูกแต่ละแปลง
      ))}
    </div>
  );
}

// PropTypes validation
FarmGrid.propTypes = {
  // Component นี้ไม่รับ props แต่กำหนด PropTypes เพื่อแสดงความเข้าใจ
};

export default FarmGrid;
