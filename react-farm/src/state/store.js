/**
 * ============================================
 * 📁 store.js - Redux Store Configuration
 * ============================================
 * 
 * ไฟล์นี้สร้างและกำหนดค่า Redux Store สำหรับแอป
 * 
 * หน้าที่หลัก:
 * 1. สร้าง Redux Store ด้วย configureStore จาก Redux Toolkit
 * 2. จัดการ Persistence: บันทึก State ลง localStorage และโหลดกลับมา
 * 3. ใช้ farmReducer จาก farmSlice.js เป็น Reducer หลัก
 * 
 * การเชื่อมโยง:
 * - farmSlice.js: Reducer ที่ใช้จัดการ State ทั้งหมด
 * - index.js: Import store นี้เพื่อใช้ใน Provider
 * - localStorage: เก็บ State เพื่อให้ข้อมูลอยู่ถาวรหลังรีเฟรชหน้า
 * 
 * Flow การทำงาน:
 * 1. โหลด State จาก localStorage (ถ้ามี)
 * 2. สร้าง Store พร้อม preloadedState (State ที่โหลดมา)
 * 3. Subscribe เพื่อบันทึก State ลง localStorage ทุกครั้งที่ State เปลี่ยน
 */

import { configureStore } from '@reduxjs/toolkit'; // 🔗 Redux Toolkit: ใช้สร้าง Store
import farmReducer from './farmSlice.js'; // 🔗 Reducer: จัดการ State ทั้งหมด

/**
 * loadState: โหลด State จาก localStorage
 * @returns {Object|undefined} State ที่โหลดมา หรือ undefined ถ้าไม่มี
 * 
 * Flow:
 * 1. อ่าน 'farm-storage' จาก localStorage
 * 2. Parse JSON string เป็น Object
 * 3. ตรวจสอบและเพิ่ม seedInventory, produceInventory ถ้ายังไม่มี
 * 4. Return State หรือ undefined (เพื่อใช้ initial state)
 */
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('farm-storage'); // 🔗 อ่านจาก localStorage
    if (serializedState === null) {
      return undefined; // ถ้าไม่มี → ให้ใช้ initial state
    }
    const parsed = JSON.parse(serializedState); // แปลง JSON string เป็น Object
    
    // ตรวจสอบและเพิ่ม seedInventory ถ้ายังไม่มี (สำหรับ compatibility)
    if (!parsed.seedInventory) {
      parsed.seedInventory = {};
    }
    // ตรวจสอบและเพิ่ม produceInventory ถ้ายังไม่มี
    if (!parsed.produceInventory) {
      parsed.produceInventory = {};
    }
    
    return parsed; // 🔗 Return State ที่โหลดมา
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined; // ถ้าเกิด error → ให้ใช้ initial state
  }
};

/**
 * saveState: บันทึก State ลง localStorage
 * @param {Object} state - Redux State ปัจจุบัน
 * 
 * Flow:
 * 1. เอา state.farm ออกมา (เพราะ store มี structure: { farm: {...} })
 * 2. แปลงเป็น JSON string
 * 3. บันทึกลง localStorage key 'farm-storage'
 */
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.farm); // แปลงเป็น JSON string
    localStorage.setItem('farm-storage', serializedState); // 🔗 บันทึกลง localStorage
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

// โหลด State ที่บันทึกไว้ (ถ้ามี)
const persistedState = loadState();

/**
 * store: Redux Store หลักของแอป
 * 
 * Configuration:
 * - reducer: { farm: farmReducer } → State structure: { farm: {...} }
 * - preloadedState: State ที่โหลดจาก localStorage (ถ้ามี)
 * 
 * หลังจากสร้าง Store:
 * - Subscribe เพื่อบันทึก State ทุกครั้งที่เปลี่ยน
 * - ทุก Action ที่ dispatch จะ trigger saveState() อัตโนมัติ
 */
const store = configureStore({
  reducer: {
    farm: farmReducer, // 🔗 ใช้ farmReducer จาก farmSlice.js
  },
  // 🔗 PreloadedState: ใช้ State ที่โหลดจาก localStorage (ถ้ามี)
  preloadedState: persistedState ? { farm: persistedState } : undefined,
});

/**
 * Subscribe: บันทึก State ทุกครั้งที่เปลี่ยน
 * 
 * Flow:
 * 1. ทุกครั้งที่ State เปลี่ยน (จากการ Dispatch Action)
 * 2. เรียก saveState() เพื่อบันทึกลง localStorage
 * 3. ทำให้ข้อมูลอยู่ถาวรแม้รีเฟรชหน้า
 */
store.subscribe(() => {
  saveState(store.getState()); // 🔗 บันทึก State ปัจจุบัน
});

export default store; // 🔗 Export Store เพื่อใช้ใน index.js