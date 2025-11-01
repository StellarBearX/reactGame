/**
 * ============================================
 * 📁 App.js - Component หลักของแอปพลิเคชัน
 * ============================================
 * 
 * ไฟล์นี้เป็น Component หลักที่ควบคุมโครงสร้างและ Flow ของแอปทั้งหมด
 * 
 * หน้าที่หลัก:
 * 1. จัดการ Routing ด้วย React Router (Routes, Route, Navigate)
 * 2. แสดง/ซ่อน Modal Components (Menu, HelpPanel)
 * 3. จัดการ State สำหรับ UI (isMenuOpen, isHelpOpen)
 * 4. เชื่อมต่อกับ Redux Store เพื่อดึงข้อมูลและ Dispatch Actions
 * 5. จัดการ Cheat Code System (ฟีเจอร์พิเศษ)
 * 6. แสดง Welcome Screen สำหรับผู้เล่นใหม่
 * 
 * การเชื่อมโยง:
 * - Components: FarmGrid, Inventory, Menu, StatusBar, WelcomeScreen, HelpPanel, TabbedSidebar, ShopPage
 * - Redux: farmSlice.js (actions และ state)
 * - Router: React Router DOM (การนำทางระหว่างหน้า)
 * 
 * Routes ที่มี:
 * - /farm: หน้าฟาร์มหลัก (แสดง FarmGrid + TabbedSidebar + Inventory)
 * - /shop: ร้านอัปเกรด (ShopPage)
 * - /inventory: หน้าจอแสดงกระเป๋าเต็มจอ
 * - /stats: หน้าสถิติ (StatsPage)
 * - /*: 404 Not Found Page
 */

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from 'react-redux'; // 🔗 Redux Hooks: ดึงข้อมูลจาก Store และ Dispatch Actions
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'; // 🔗 React Router: จัดการ URL routing
import FarmGrid from "./components/FarmGrid.js"; // 🔗 แสดงแปลงปลูกทั้งหมด
import Inventory from "./components/Inventory.js"; // 🔗 แสดงเมล็ดและผลผลิตในกระเป๋า
import Menu from "./components/Menu.js"; // 🔗 เมนูหลักสำหรับนำทาง
import StatusBar from "./components/StatusBar.js"; // 🔗 แถบสถานะด้านบน (เงิน, เวลา, เลเวล)
import WelcomeScreen from "./components/WelcomeScreen.js"; // 🔗 หน้าต้อนรับผู้เล่นใหม่
import HelpPanel from "./components/HelpPanel.js"; // 🔗 คู่มือช่วยเหลือ
import TabbedSidebar from "./components/TabbedSidebar.js"; // 🔗 Sidebar แบบ Tab (Shop, Market, Crafting, Contracts)
import ShopPage from "./components/ShopPage.js"; // 🔗 ร้านอัปเกรด (ซื้อแปลง, ปลดล็อกสถานี)
import { markWelcomeSeen, setPage, cheatUnlockAll, resetGame } from './state/farmSlice.js'; // 🔗 Redux Actions
import { Home } from 'lucide-react'; // 🔗 Icon Library

// ============================================
// Styled Components - กำหนด Style สำหรับ Layout
// ============================================

/**
 * AppContainer: Container หลักของแอป
 * - Background: Linear gradient สีเขียว (ธีมฟาร์ม)
 * - Responsive: ปรับ padding-top ตามขนาดหน้าจอ
 */
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%);
  width: 100%;
  min-height: 100vh;
  padding-top: 100px; // ไว้ที่สำหรับ StatusBar ที่ position: fixed

  @media (max-width: 1245px) {
    padding-top: 130px;
  }

  @media (max-width: 768px) {
    padding-top: 160px;
  }

  @media (max-width: 480px) {
    padding-top: 180px;
  }
`;

const Header = styled.header`
  text-align: center;
  background-color: #a5d6a7;
  padding: 10px 0;
  width: 100%;
  border-radius: 8px;
`;

const Title = styled.h1`
  margin: 0;
  color: #2e7d32;
  font-size: 24px;
`;

/**
 * MainSection: ส่วนหลักสำหรับแสดง Content
 * - Layout: Flexbox แนวนอน (Farm Section + Sidebar)
 */
const MainSection = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  width: 90%;
  margin-top: 20px;
`;

/**
 * FarmSection: ส่วนแสดงฟาร์ม (แปลงปลูก)
 * - flex: 2 → ใช้พื้นที่ 2 ส่วน (ใหญ่กว่า Sidebar)
 */
const FarmSection = styled.section`
  flex: 2;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

/**
 * Sidebar: ส่วนแสดง Sidebar (TabbedSidebar + Inventory)
 * - flex: 1 → ใช้พื้นที่ 1 ส่วน
 */
const Sidebar = styled.aside`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Footer = styled.footer`
  margin-top: 30px;
  text-align: center;
  color: #555;
  font-size: 14px;
`;

// ============================================
// Sub-Components (ใช้ใน Routes)
// ============================================

/**
 * NotFoundPage: หน้าสำหรับ Route ที่ไม่พบ (404)
 * - แสดงเมื่อเข้าหน้าที่ไม่มีในระบบ
 * - มีปุ่มกลับไปที่ /farm
 */
function NotFoundPage() {
  const navigate = useNavigate(); // 🔗 React Router Hook: สำหรับเปลี่ยน URL
  
  return (
    <div style={{ 
      flex: 1, 
      borderRadius: '8px', 
      padding: '40px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh'
    }}>
      <div style={{ fontSize: '72px', marginBottom: '20px' }}>🔍</div>
      <h2 style={{ 
        color: '#ef4444', 
        marginBottom: '16px',
        fontSize: '32px'
      }}>
        ไม่พบหน้าที่ต้องการ
      </h2>
      <p style={{ 
        color: '#6b7280', 
        marginBottom: '30px',
        fontSize: '18px'
      }}>
        หน้าที่คุณกำลังมองหาไม่มีอยู่ในระบบ
      </p>
      <button
        onClick={() => navigate('/farm')} // 🔗 กลับไปที่หน้าฟาร์ม
        style={{
          background: 'linear-gradient(to right, #10b981, #059669)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        <Home size={20} />
        กลับสู่ฟาร์ม
      </button>
    </div>
  );
}

/**
 * StatsPage: หน้าสถิติ (แสดงผลงานผู้เล่น)
 * - ดึงข้อมูลจาก Redux Store: money, statistics, level
 * - แสดงการ์ดสถิติ: ระดับ, เงินทั้งหมด, ปลูกทั้งหมด, เก็บเกี่ยวทั้งหมด, รายได้รวม
 */
function StatsPage() {
  // 🔗 Redux: ดึงข้อมูลจาก Store
  const money = useSelector((state) => state.farm.money);
  const statistics = useSelector((state) => state.farm.statistics || {});
  const level = useSelector((state) => state.farm.level);

  return (
    <div style={{ 
      flex: 1, 
      background: '#fff', 
      borderRadius: '8px', 
      padding: '30px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#f97316', marginBottom: '30px' }}>📊 สถิติ</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {/* การ์ด: ระดับ */}
        <div style={{
          background: '#fff7ed',
          padding: '24px',
          borderRadius: '12px',
          border: '2px solid #fed7aa'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>⭐</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>ระดับ</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f97316' }}>
            Level {level}
          </div>
        </div>
        
        {/* การ์ด: เงินทั้งหมด */}
        <div style={{
          background: '#fff7ed',
          padding: '24px',
          borderRadius: '12px',
          border: '2px solid #fed7aa'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>💰</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>เงินทั้งหมด</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f97316' }}>
            ฿{money.toLocaleString()}
          </div>
        </div>
        
        {/* การ์ด: ปลูกทั้งหมด */}
        <div style={{
          background: '#f0fdf4',
          padding: '24px',
          borderRadius: '12px',
          border: '2px solid #bbf7d0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌱</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>ปลูกทั้งหมด</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
            {statistics.totalPlanted || 0} ชิ้น
          </div>
        </div>
        
        {/* การ์ด: เก็บเกี่ยวทั้งหมด */}
        <div style={{
          background: '#f0fdf4',
          padding: '24px',
          borderRadius: '12px',
          border: '2px solid #bbf7d0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌾</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>เก็บเกี่ยวทั้งหมด</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
            {statistics.totalHarvested || 0} ชิ้น
          </div>
        </div>
        
        {/* การ์ด: รายได้รวม */}
        <div style={{
          background: '#eff6ff',
          padding: '24px',
          borderRadius: '12px',
          border: '2px solid #bfdbfe'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>📈</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>รายได้รวม</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>
            ฿{(statistics.totalEarned || 0).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main App Component
// ============================================

/**
 * App: Component หลักของแอป
 * 
 * Flow การทำงาน:
 * 1. ตรวจสอบว่าเห็น Welcome Screen แล้วหรือยัง
 * 2. ถ้ายังไม่เห็น → แสดง WelcomeScreen
 * 3. ถ้าเห็นแล้ว → แสดงหน้า Main App พร้อม Routes
 */
function App() {
  // 🔗 Redux: Dispatch Actions
  const dispatch = useDispatch();
  
  // 🔗 React Router: ดึงข้อมูล URL ปัจจุบัน
  const location = useLocation(); // ใช้ตรวจสอบ pathname
  const navigate = useNavigate(); // ใช้เปลี่ยนหน้า (ไม่ใช้ตรงนี้ แต่เตรียมไว้)
  
  // 🔗 React Hooks: State สำหรับ Modal Components
  const [isMenuOpen, setIsMenuOpen] = useState(false); // เปิด/ปิดเมนู
  const [isHelpOpen, setIsHelpOpen] = useState(false); // เปิด/ปิด Help Panel
  
  // 🔗 Redux: ดึงข้อมูลจาก Store
  const currentPage = useSelector((state) => state.farm.currentPage); // หน้าที่เปิดอยู่
  const money = useSelector((state) => state.farm.money); // เงิน
  const seedInventory = useSelector((state) => state.farm.seedInventory || {}); // เมล็ดในกระเป๋า
  const statistics = useSelector((state) => state.farm.statistics || {}); // สถิติ
  const level = useSelector((state) => state.farm.level); // ระดับ
  const hasSeenWelcome = useSelector((state) => state.farm.tutorial.hasSeenWelcome); // เห็น Welcome Screen แล้วหรือยัง

  // คำนวณจำนวนของทั้งหมดในกระเป๋า
  const totalItems = Object.values(seedInventory).reduce((sum, count) => sum + count, 0);
  
  // ============================================
  // Cheat Code System (ฟีเจอร์พิเศษ)
  // ============================================
  
  /**
   * ระบบ Cheat Code: ตรวจจับการพิมพ์ "cheatcode" หรือ "reset"
   * - เก็บตัวอักษรที่พิมพ์ไว้ใน useRef
   * - ตรวจสอบว่ามีคำที่ต้องการหรือไม่
   * - "cheatcode" → ปลดล็อกทุกอย่าง (cheatUnlockAll)
   * - "reset" → รีเซ็ตเกม (resetGame)
   */
  const cheatInputRef = useRef(''); // เก็บตัวอักษรที่พิมพ์
  const cheatTimeoutRef = useRef(null); // เก็บ timeout สำหรับรีเซ็ต buffer
  
  // 🔗 useEffect: ตรวจจับการกดปุ่มคีย์บอร์ด
  useEffect(() => {
    const handleKeyPress = (e) => {
      // ข้ามคีย์พิเศษ (Shift, Ctrl, Alt, etc.)
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      
      // เพิ่มตัวอักษรเข้า buffer (แปลงเป็นตัวพิมพ์เล็ก)
      cheatInputRef.current += e.key.toLowerCase();
      
      // จำกัดขนาด buffer (สูงสุด 50 ตัวอักษร เพื่อป้องกันปัญหา memory)
      if (cheatInputRef.current.length > 50) {
        cheatInputRef.current = cheatInputRef.current.slice(-50);
      }
      
      // ล้าง timeout เก่า
      if (cheatTimeoutRef.current) {
        clearTimeout(cheatTimeoutRef.current);
      }
      
      // ตรวจสอบว่า buffer มี "cheatcode" หรือไม่
      if (cheatInputRef.current.includes('cheatcode')) {
        dispatch(cheatUnlockAll()); // 🔗 Redux Action: ปลดล็อกทุกอย่าง
        console.log('เยียๆ สูตรโกงมาละจ้า!');
        cheatInputRef.current = '';
      } 
      // ตรวจสอบว่า buffer มี "reset" หรือไม่
      else if (cheatInputRef.current.includes('reset')) {
        dispatch(resetGame()); // 🔗 Redux Action: รีเซ็ตเกม
        console.log('🔄 Game reset!');
        cheatInputRef.current = '';
      } else {
        // รีเซ็ต buffer หลังจาก 3 วินาทีถ้าไม่พบคำที่ต้องการ
        cheatTimeoutRef.current = setTimeout(() => {
          cheatInputRef.current = '';
        }, 3000);
      }
    };
    
    // เพิ่ม Event Listener
    window.addEventListener('keydown', handleKeyPress);
    
    // Cleanup: ลบ Event Listener เมื่อ Component Unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (cheatTimeoutRef.current) {
        clearTimeout(cheatTimeoutRef.current);
      }
    };
  }, [dispatch]);
  
  /**
   * useEffect: Intercept console.log และสร้างฟังก์ชันพิเศษ
   * - สร้าง window.cheatUnlockAll() และ window.resetGame()
   * - ตรวจจับคำใน console.log
   */
  useEffect(() => {
    const originalConsoleLog = console.log;
    
    // สร้างฟังก์ชันพิเศษบน window object
    window.cheatUnlockAll = () => {
      dispatch(cheatUnlockAll());
      originalConsoleLog('เยียๆ สูตรโกงมาละจ้า!');
    };
    
    window.resetGame = () => {
      dispatch(resetGame());
      originalConsoleLog('🔄 Game reset!');
    };
    
    // Intercept console.log เพื่อตรวจสอบคำพิเศษ
    console.log = (...args) => {
      const logString = args.map(arg => String(arg)).join(' ').toLowerCase();
      const hasCheatCode = logString.includes('cheatcode');
      const hasReset = logString.includes('reset');
      
      if (hasCheatCode) {
        dispatch(cheatUnlockAll());
        originalConsoleLog('เยียๆ สูตรโกงมาละจ้า!');
      } else if (hasReset) {
        dispatch(resetGame());
        originalConsoleLog('🔄 Game reset!');
      } else {
        // เรียก console.log เดิม
        originalConsoleLog.apply(console, args);
      }
    };
    
    // Cleanup: คืนค่าเดิมเมื่อ Component Unmount
    return () => {
      delete window.cheatUnlockAll;
      delete window.resetGame;
      console.log = originalConsoleLog;
    };
  }, [dispatch]);
  
  // ============================================
  // Event Handlers
  // ============================================
  
  /**
   * handleStartGame: เริ่มเกม (ปิด Welcome Screen)
   * - Dispatch markWelcomeSeen() เพื่อบันทึกว่าเห็น Welcome Screen แล้ว
   */
  const handleStartGame = () => {
    dispatch(markWelcomeSeen()); // 🔗 Redux Action: บันทึกว่าเห็น Welcome Screen แล้ว
  };

  // ============================================
  // useEffect: Sync URL with Redux State
  // ============================================
  
  /**
   * useEffect: ซิงค์ URL กับ Redux currentPage state
   * - เพื่อให้ Redux state และ URL สอดคล้องกัน
   * - ใช้สำหรับ backward compatibility
   */
  useEffect(() => {
    const path = location.pathname === '/' ? 'farm' : location.pathname.replace('/', '');
    if (path !== currentPage) {
      dispatch(setPage(path)); // 🔗 Redux Action: อัพเดท currentPage
    }
  }, [location.pathname, dispatch, currentPage]);

  // ============================================
  // Conditional Rendering: Welcome Screen
  // ============================================
  
  /**
   * ตรวจสอบว่าแสดง Welcome Screen หรือไม่
   * - ถ้ายังไม่เห็น Welcome Screen และเป็น route ที่ถูกต้อง → แสดง WelcomeScreen
   * - ถ้าเป็น route ที่ไม่ถูกต้อง (404) → ไม่แสดง WelcomeScreen (แสดง NotFoundPage แทน)
   */
  const isInvalidRoute = location.pathname !== '/' && 
                         location.pathname !== '/farm' && 
                         location.pathname !== '/shop' && 
                         location.pathname !== '/inventory' && 
                         location.pathname !== '/stats';
  
  // ถ้ายังไม่เห็น Welcome Screen → แสดง WelcomeScreen
  if (!hasSeenWelcome && !isInvalidRoute) {
    return <WelcomeScreen onStartGame={handleStartGame} />; // 🔗 Component: หน้าต้อนรับ
  }

  // ============================================
  // Main Render: แสดงแอปหลัก
  // ============================================
  
  return (
    <AppContainer>
      {/* StatusBar: แถบสถานะด้านบน */}
      {/* 🔗 Component: StatusBar - แสดงเงิน, เวลา, เลเวล, ปุ่มเมนู, ปุ่มช่วยเหลือ */}
      {/* Props: onMenuClick → เปิด Menu, onHelpClick → เปิด HelpPanel */}
      <StatusBar 
        onMenuClick={() => setIsMenuOpen(true)}
        onHelpClick={() => setIsHelpOpen(true)}
      />

      {/* MainSection: ส่วนหลักสำหรับแสดง Content */}
      <MainSection>
        {/* React Router: จัดการ Routes */}
        {/* 🔗 React Router - Routes แสดง Component ตาม URL */}
        <Routes>
          {/* Route: / → Redirect ไปที่ /farm */}
          <Route path="/" element={<Navigate to="/farm" replace />} />
          
          {/* Route: /farm → หน้าฟาร์มหลัก */}
          {/* 🔗 Components: FarmGrid, TabbedSidebar, Inventory */}
          <Route 
            path="/farm" 
            element={
              <>
                {/* FarmSection: แสดงแปลงปลูก */}
                <FarmSection>
                  <FarmGrid /> {/* 🔗 Component: แสดงแปลงปลูกทั้งหมด */}
                </FarmSection>
                
                {/* Sidebar: แสดง TabbedSidebar และ Inventory */}
                <Sidebar>
                  <TabbedSidebar /> {/* 🔗 Component: Tab สำหรับ Shop, Market, Crafting, Contracts */}
                  <Inventory /> {/* 🔗 Component: แสดงเมล็ดและผลผลิตในกระเป๋า */}
                </Sidebar>
              </>
            } 
          />
          
          {/* Route: /shop → ร้านอัปเกรด */}
          {/* 🔗 Component: ShopPage */}
          <Route 
            path="/shop" 
            element={
              <div style={{ 
                flex: 1, 
                background: '#fff', 
                borderRadius: '8px', 
                padding: '20px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
              }}>
                <ShopPage /> {/* 🔗 Component: ร้านซื้อแปลงและปลดล็อกสถานี */}
              </div>
            } 
          />
          
          {/* Route: /inventory → หน้าจอแสดงกระเป๋าเต็มจอ */}
          {/* 🔗 Component: Inventory */}
          <Route 
            path="/inventory" 
            element={
              <div style={{ 
                flex: 1, 
                background: '#fff', 
                borderRadius: '8px', 
                padding: '20px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
              }}>
                <Inventory /> {/* 🔗 Component: แสดงเมล็ดและผลผลิตเต็มจอ */}
              </div>
            } 
          />
          
          {/* Route: /stats → หน้าสถิติ */}
          {/* 🔗 Component: StatsPage (กำหนดในไฟล์นี้) */}
          <Route 
            path="/stats" 
            element={<StatsPage />} 
          />
          
          {/* Route: * → 404 Not Found (ต้องอยู่ล่างสุด) */}
          {/* 🔗 Component: NotFoundPage (กำหนดในไฟล์นี้) */}
          <Route 
            path="*" 
            element={<NotFoundPage />} 
          />
        </Routes>
      </MainSection>

      {/* Footer: ข้อความด้านล่าง */}
      <Footer>© 2025 Cozy Farm Team | Powered by Redux Toolkit</Footer>

      {/* Menu: Modal สำหรับเมนูหลัก */}
      {/* 🔗 Component: Menu - แสดงรายการหน้าต่างๆ และปุ่มรีเซ็ต */}
      {/* Props: isOpen → เปิด/ปิด, onClose → ปิด Menu */}
      <Menu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
      
      {/* HelpPanel: Modal สำหรับคู่มือช่วยเหลือ */}
      {/* 🔗 Component: HelpPanel - แสดงคู่มือการเล่น */}
      {/* Props: isOpen → เปิด/ปิด, onClose → ปิด HelpPanel */}
      <HelpPanel 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />
    </AppContainer>
  );
}

export default App;
