import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from 'react-redux'; // ✅ ข้อ 5: useSelector (15%)
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import FarmGrid from "./components/FarmGrid.js";
import Inventory from "./components/Inventory.js";
import Menu from "./components/Menu.js";
import StatusBar from "./components/StatusBar.js";
import WelcomeScreen from "./components/WelcomeScreen.js";
import HelpPanel from "./components/HelpPanel.js";
import TabbedSidebar from "./components/TabbedSidebar.js";
import ShopPage from "./components/ShopPage.js";
import { markWelcomeSeen, setPage, cheatUnlockAll, resetGame } from './state/farmSlice.js';
import { Home } from 'lucide-react';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%);
  width: 100%;
  min-height: 100vh;
  padding-top: 100px;
  position: relative;

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

const MainSection = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  width: 90%;
  margin-top: 20px;
`;

const FarmSection = styled.section`
  flex: 2;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

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

// 404 Not Found Page Component
function NotFoundPage() {
  const navigate = useNavigate();
  
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
        onClick={() => navigate('/farm')}
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

// Statistics Page Component
function StatsPage() {
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

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ ข้อ 4: useState สำหรับเปิด/ปิดเมนู (15%)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // ✅ ข้อ 5: ใช้ Redux useSelector (15%)
  const currentPage = useSelector((state) => state.farm.currentPage);
  const money = useSelector((state) => state.farm.money);
  const seedInventory = useSelector((state) => state.farm.seedInventory || {});
  const statistics = useSelector((state) => state.farm.statistics || {});
  const level = useSelector((state) => state.farm.level);
  const hasSeenWelcome = useSelector((state) => state.farm.tutorial.hasSeenWelcome);

  const totalItems = Object.values(seedInventory).reduce((sum, count) => sum + count, 0);
  
  // Cheat code system: Listen for "cheatcode" and "reset" patterns
  const cheatInputRef = useRef('');
  const cheatTimeoutRef = useRef(null);
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore special keys (Shift, Ctrl, Alt, etc.) and modifier keys
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      
      // Add character to input buffer (lowercase for case-insensitive matching)
      cheatInputRef.current += e.key.toLowerCase();
      
      // Keep buffer size reasonable (max 50 characters to prevent memory issues)
      if (cheatInputRef.current.length > 50) {
        cheatInputRef.current = cheatInputRef.current.slice(-50);
      }
      
      // Clear previous timeout
      if (cheatTimeoutRef.current) {
        clearTimeout(cheatTimeoutRef.current);
      }
      
      // Check if buffer contains "cheatcode"
      if (cheatInputRef.current.includes('cheatcode')) {
        dispatch(cheatUnlockAll());
        console.log('เยียๆ สูตรโกงมาละจ้า!');
        cheatInputRef.current = '';
      } 
      // Check if buffer contains "reset"
      else if (cheatInputRef.current.includes('reset')) {
        dispatch(resetGame());
        console.log('🔄 Game reset!');
        cheatInputRef.current = '';
      } else {
        // Reset input after 3 seconds of no match
        cheatTimeoutRef.current = setTimeout(() => {
          cheatInputRef.current = '';
        }, 3000);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (cheatTimeoutRef.current) {
        clearTimeout(cheatTimeoutRef.current);
      }
    };
  }, [dispatch]);
  
  // Also expose a console function and intercept console.log for cheat patterns
  useEffect(() => {
    // Intercept console.log to detect cheat patterns
    const originalConsoleLog = console.log;
    
    // Expose cheat function to window
    window.cheatUnlockAll = () => {
      dispatch(cheatUnlockAll());
      originalConsoleLog('เยียๆ สูตรโกงมาละจ้า!');
    };
    
    // Expose reset function to window
    window.resetGame = () => {
      dispatch(resetGame());
      originalConsoleLog('🔄 Game reset!');
    };
    
    console.log = (...args) => {
      // Check if any argument contains cheat patterns
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
        // Call original console.log
        originalConsoleLog.apply(console, args);
      }
    };
    
    return () => {
      delete window.cheatUnlockAll;
      delete window.resetGame;
      console.log = originalConsoleLog;
    };
  }, [dispatch]);
  
  
  // ฟังก์ชันสำหรับเริ่มเกม
  const handleStartGame = () => {
    dispatch(markWelcomeSeen());
  };

  // Sync URL with Redux currentPage state for backward compatibility
  useEffect(() => {
    const path = location.pathname === '/' ? 'farm' : location.pathname.replace('/', '');
    if (path !== currentPage) {
      dispatch(setPage(path));
    }
  }, [location.pathname, dispatch, currentPage]);

  // แสดง Welcome Screen สำหรับผู้เล่นใหม่ (เฉพาะ route หลักเท่านั้น)
  // ไม่แสดง WelcomeScreen สำหรับ unknown routes (404)
  const isInvalidRoute = location.pathname !== '/' && 
                         location.pathname !== '/farm' && 
                         location.pathname !== '/shop' && 
                         location.pathname !== '/inventory' && 
                         location.pathname !== '/stats';
  
  if (!hasSeenWelcome && !isInvalidRoute) {
    return <WelcomeScreen onStartGame={handleStartGame} />;
  }

  return (
    <AppContainer>
      {/* ✅ StatusBar Component พร้อม props */}
      <StatusBar 
        onMenuClick={() => setIsMenuOpen(true)}
        onHelpClick={() => setIsHelpOpen(true)}
      />

      <MainSection>
        {/* ✅ React Router Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/farm" replace />} />
          <Route 
            path="/farm" 
            element={
              <>
                <FarmSection>
                  <FarmGrid />
                </FarmSection>
                <Sidebar>
                  <TabbedSidebar />
                  <Inventory />
                </Sidebar>
              </>
            } 
          />
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
                <ShopPage />
              </div>
            } 
          />
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
                <Inventory />
              </div>
            } 
          />
          <Route 
            path="/stats" 
            element={<StatsPage />} 
          />
          <Route 
            path="*" 
            element={<NotFoundPage />} 
          />
        </Routes>
      </MainSection>

      {/* Floating Back to Farm Button */}
      {/* {location.pathname !== '/farm' && location.pathname !== '/' && (
      <button
          onClick={() => navigate('/farm')}
        style={{
          position: 'fixed',
          left: '20px',
          bottom: '20px',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(to right, #10b981, #059669)',
          color: 'white',
          border: 'none',
          padding: '10px 14px',
          borderRadius: '999px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
          cursor: 'pointer'
        }}
          title="กลับสู่ฟาร์ม"
      >
          <Home size={18} />
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
            กลับฟาร์ม
        </span>
      </button>
      )} */}

      <Footer>© 2025 Cozy Farm Team | Powered by Redux Toolkit</Footer>

      {/* ✅ Menu Component */}
      <Menu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
      
      {/* ✅ Help Panel */}
      <HelpPanel 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />
    </AppContainer>
  );
}

export default App;