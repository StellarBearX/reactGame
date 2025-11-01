/**
 * ============================================
 * 📁 index.js - ไฟล์ Entry Point หลักของแอป
 * ============================================
 * 
 * ไฟล์นี้เป็นจุดเริ่มต้นของแอปพลิเคชัน React Farm Game
 * มีหน้าที่:
 * 1. สร้าง Root DOM Node และ Render แอปทั้งหมด
 * 2. ตั้งค่า Redux Provider เพื่อให้ทุก Component เข้าถึง Store ได้
 * 3. ตั้งค่า React Router (BrowserRouter) สำหรับการนำทางระหว่างหน้า
 * 
 * การเชื่อมโยง:
 * - App.js: Component หลักของแอป
 * - ./state/store.js: Redux Store ที่เก็บ State ทั้งหมด
 * - ./index.css: CSS Global Styles
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js'; // 🔗 Component หลัก - ดู App.js
import './index.css'; // 🔗 CSS Global Styles
import { Provider } from 'react-redux'; // 🔗 Redux Provider - ให้ทุก Component เข้าถึง Store
import store from './state/store.js'; // 🔗 Redux Store - ดู state/store.js
import { BrowserRouter } from 'react-router-dom'; // 🔗 React Router - สำหรับ URL routing

// สร้าง Root DOM Element จาก #root ใน public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render แอปทั้งหมดเข้า DOM
root.render(
  <React.StrictMode>
    {/* Redux Provider: ห่อแอปทั้งหมดด้วย Provider เพื่อให้เข้าถึง Store */}
    {/* 🔗 เชื่อมกับ: state/store.js - เก็บ State ทั้งหมด (money, plots, inventory, etc.) */}
    <Provider store={store}>
      {/* React Router: จัดการ URL routing ระหว่างหน้า */}
      {/* 🔗 เชื่อมกับ: App.js - ใช้ Routes/Route เพื่อแสดงหน้าที่ถูกต้อง */}
      <BrowserRouter>
        {/* Component หลักของแอป - ดู App.js */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);