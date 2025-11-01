/**
 * ============================================
 * 📁 Plot.js - Component แสดงแปลงปลูกแต่ละแปลง
 * ============================================
 * 
 * ไฟล์นี้แสดงแปลงปลูกพืชแต่ละแปลง พร้อมข้อมูลพืชที่ปลูกอยู่
 * 
 * หน้าที่หลัก:
 * 1. แสดงแปลงว่างหรือแปลงที่มีพืชปลูกอยู่
 * 2. จัดการการคลิกแปลง: ปลูกพืช หรือ เก็บเกี่ยว
 * 3. แสดงความคืบหน้าของการเติบโต (progress bar, time remaining)
 * 4. อัพเดท UI ทุก 1 วินาที (ใช้ useEffect + setInterval)
 * 
 * การเชื่อมโยง:
 * - FarmGrid.js: เรียกใช้ Component นี้เพื่อแสดงแต่ละแปลง
 * - farmSlice.js: เรียกใช้ plantCrop และ harvestCrop actions
 * - time.js: ใช้คำนวณความคืบหน้าและเวลาที่เหลือ
 * - crops.js: ดึงข้อมูลพืช (icon, name, growTime)
 * - sound.js: เล่นเสียงเมื่อปลูกและเก็บเกี่ยว
 * 
 * Props:
 * - plot: Object { id, crop, plantedAt, isGrown }
 * 
 * State:
 * - tick: ใช้ trigger re-render ทุก 1 วินาที
 */

import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'; // 🔗 Redux Hooks: ดึงข้อมูลและ Dispatch Actions
import { plantCrop, harvestCrop } from '../state/farmSlice.js'; // 🔗 Redux Actions: ปลูกและเก็บเกี่ยว
import { calculateGrowthProgress, getTimeRemaining, formatTime, isFullyGrown } from "../utils/time.js"; // 🔗 Utilities: คำนวณเวลา
import { CROPS_DATA } from '../data/crops.js'; // 🔗 ข้อมูลพืชทั้งหมด
import { playHarvest, playPick } from '../utils/sound.js'; // 🔗 เสียงเอฟเฟกต์

/**
 * Plot: Component แสดงแปลงปลูกพืช
 * 
 * @param {Object} plot - ข้อมูลแปลงปลูก { id, crop, plantedAt, isGrown }
 */
function Plot({ plot }) {
  // 🔗 Redux: Dispatch Actions
  const dispatch = useDispatch();
  
  // 🔗 Redux: ดึง selectedSeed จาก Store (เมล็ดที่เลือกไว้สำหรับปลูก)
  const selectedSeed = useSelector((state) => state.farm.selectedSeed);
  
  // 🔗 ดึงข้อมูลพืชจาก CROPS_DATA (ถ้ามีพืชปลูกอยู่)
  const crop = plot.crop ? CROPS_DATA[plot.crop] : null;

  // State สำหรับ trigger re-render ทุก 1 วินาที
  // ใช้เพื่ออัพเดท UI (progress, time remaining) ให้อัพเดทแบบ real-time
  const [, setTick] = useState(0);

  /**
   * useEffect: อัพเดท UI ทุก 1 วินาที
   * 
   * Flow:
   * 1. ตรวจสอบว่ามีพืชปลูกอยู่หรือไม่ (plot.crop)
   * 2. สร้าง setInterval เรียก setTick ทุก 1 วินาที
   * 3. setTick จะ trigger re-render เพื่ออัพเดท UI
   * 4. Cleanup: ลบ interval เมื่อ Component Unmount หรือ plot.crop เปลี่ยน
   */
  useEffect(() => {
    if (!plot.crop) return; // ถ้าแปลงว่าง → ไม่ต้องอัพเดท
    
    const interval = setInterval(() => {
      setTick(t => t + 1); // 🔗 Trigger re-render ทุก 1 วินาที
    }, 1000);
    
    return () => clearInterval(interval); // Cleanup
  }, [plot.crop]);

  /**
   * handlePlotClick: จัดการการคลิกแปลง
   * 
   * Flow:
   * 1. ถ้าแปลงว่าง + มีเมล็ดเลือกอยู่ → ปลูกพืช (dispatch plantCrop)
   * 2. ถ้ามีพืช + เติบโตเต็มที่ (grown) → เก็บเกี่ยว (dispatch harvestCrop)
   * 
   * 🔗 Redux Actions: plantCrop, harvestCrop
   * 🔗 Sound Effects: playPick (ปลูก), playHarvest (เก็บเกี่ยว)
   */
  const handlePlotClick = () => {
    if (!plot.crop && selectedSeed) {
      // กรณี: แปลงว่าง + มีเมล็ดเลือก → ปลูกพืช
      dispatch(plantCrop(plot.id)); // 🔗 Redux Action: ปลูกพืช
      playPick(); // 🔗 เสียง: ปลูกพืช
    } else if (plot.crop && grown) {
      // กรณี: มีพืช + เติบโตเต็มที่ → เก็บเกี่ยว
      dispatch(harvestCrop(plot.id)); // 🔗 Redux Action: เก็บเกี่ยว
      playHarvest(); // 🔗 เสียง: เก็บเกี่ยว
    }
  };

  // ถ้าแปลงว่าง → แสดงปุ่มปลูก
  if (!plot.crop) {
    return (
      <div className="plot empty" onClick={handlePlotClick}>
        {/* ถ้ามีเมล็ดเลือก → แสดงคำแนะนำปลูก, ถ้าไม่มี → แสดง "ว่าง" */}
        {selectedSeed ? '🌱 คลิกเพื่อปลูก' : 'ว่าง'}
      </div>
    );
  }

  // คำนวณข้อมูลการเติบโต
  const progress = calculateGrowthProgress(plot.plantedAt, crop.growTime); // 🔗 คำนวณเปอร์เซ็นต์ความคืบหน้า
  const grown = isFullyGrown(plot.plantedAt, crop.growTime); // 🔗 ตรวจสอบว่าเติบโตเต็มที่หรือยัง
  const timeLeft = getTimeRemaining(plot.plantedAt, crop.growTime); // 🔗 เวลาที่เหลือ

  // แสดงแปลงที่มีพืชปลูกอยู่
  return (
    <div
      className={`plot ${grown ? "grown" : "growing"}`} // CSS class: grown หรือ growing
      onClick={handlePlotClick}
    >
      {/* แสดงไอคอนและชื่อพืช */}
      <div>{crop.icon} {crop.name}</div>
      
      {/* ถ้าเติบโตเต็มที่ → แสดง "เก็บเกี่ยวได้!" */}
      {/* ถ้ายังไม่เติบโต → แสดง progress % และเวลาที่เหลือ */}
      {grown ? (
        <span>เก็บเกี่ยวได้!</span>
      ) : (
        <span>{progress.toFixed(0)}% ({formatTime(timeLeft)})</span> // 🔗 แสดง progress และ time remaining
      )}
    </div>
  );
}

// PropTypes validation
Plot.propTypes = {
  plot: PropTypes.shape({
    id: PropTypes.number.isRequired, // ID ของแปลง
    crop: PropTypes.string, // ID ของพืชที่ปลูก (เช่น 'tomato') หรือ null
    plantedAt: PropTypes.number, // Timestamp เมื่อปลูก
    isGrown: PropTypes.bool // พืชเติบโตเต็มที่แล้วหรือยัง
  }).isRequired
};

export default Plot;
