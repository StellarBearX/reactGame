import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from 'react-redux'; // ✅ ข้อ 5: useSelector (15%)
import FarmGrid from "./components/FarmGrid.js";
import Inventory from "./components/Inventory.js";
import Shop from "./components/Shop.js";
import Menu from "./components/Menu.js";
import StatusBar from "./components/StatusBar.js";
import MarketBoard from "./components/MarketBoard.js";
import ContractsPanel from "./components/ContractsPanel.js";
import CraftingStation from "./components/CraftingStation.js";
import WelcomeScreen from "./components/WelcomeScreen.js";
import HelpPanel from "./components/HelpPanel.js";
import { markWelcomeSeen, setPage } from './state/farmSlice.js';
import { Home, Store as StoreIcon } from 'lucide-react';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%);
  min-height: 100vh;
  padding-top: 80px;
  position: relative;
  overflow-x: hidden;
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

function App() {
  const dispatch = useDispatch();
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
  
  // ฟังก์ชันสำหรับจัดการการออกจากเกม
  const handleExitGame = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะออกจากเกม? ข้อมูลเกมจะถูกบันทึกอัตโนมัติ')) {
      // บันทึกข้อมูลเกมก่อนออก
      window.localStorage.setItem('farm-exit-time', Date.now().toString());
      // ปิดหน้าต่างหรือแท็บ
      window.close();
    }
  };
  
  // ฟังก์ชันสำหรับเริ่มเกม
  const handleStartGame = () => {
    dispatch(markWelcomeSeen());
  };

  // ✅ ฟังก์ชันสำหรับแสดงเนื้อหาตาม currentPage
  const renderContent = () => {
    switch (currentPage) {
      case 'farm':
        return (
          <>
            <FarmSection>
              <FarmGrid />
            </FarmSection>
            <Sidebar>
              <Shop />
              <Inventory />
            </Sidebar>
          </>
        );
      
      case 'shop':
        return (
          <div style={{ 
            flex: 1, 
            background: '#fff', 
            borderRadius: '8px', 
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}>
            <Shop />
          </div>
        );
      
      case 'inventory':
        return (
          <div style={{ 
            flex: 1, 
            background: '#fff', 
            borderRadius: '8px', 
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}>
            <Inventory />
          </div>
        );
      
      case 'market':
        return (
          <div style={{ 
            flex: 1, 
            background: '#fff', 
            borderRadius: '8px', 
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}>
            <MarketBoard />
          </div>
        );
      
      case 'contracts':
        return (
          <div style={{ 
            flex: 1, 
            background: '#fff', 
            borderRadius: '8px', 
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}>
            <ContractsPanel />
          </div>
        );
      
      case 'crafting':
        return (
          <div style={{ 
            flex: 1, 
            background: '#fff', 
            borderRadius: '8px', 
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}>
            <CraftingStation />
          </div>
        );
      
      case 'stats':
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
      
      default:
        return (
          <>
            <FarmSection>
              <FarmGrid />
            </FarmSection>
            <Sidebar>
              <Shop />
              <Inventory />
            </Sidebar>
          </>
        );
    }
  };

  // แสดง Welcome Screen สำหรับผู้เล่นใหม่
  if (!hasSeenWelcome) {
    return <WelcomeScreen onStartGame={handleStartGame} />;
  }

  return (
    <AppContainer>
      {/* ✅ StatusBar Component พร้อม props */}
      <StatusBar 
        onMenuClick={() => setIsMenuOpen(true)}
        onHelpClick={() => setIsHelpOpen(true)}
        onExitClick={handleExitGame}
      />
      
      <Header>
        <Title>🌾 Cozy Farm Life 🌿</Title>
      </Header>

      <MainSection>
        {/* ✅ แสดงเนื้อหาตาม currentPage */}
        {renderContent()}
      </MainSection>

      {/* Floating Back/Shop Button */}
      <button
        onClick={() => dispatch(setPage(currentPage === 'farm' ? 'shop' : 'farm'))}
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
        title={currentPage === 'farm' ? 'ไปที่ร้านค้า' : 'กลับสู่ฟาร์ม'}
      >
        {currentPage === 'farm' ? <StoreIcon size={18} /> : <Home size={18} />}
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
          {currentPage === 'farm' ? 'ร้านค้า' : 'กลับฟาร์ม'}
        </span>
      </button>

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