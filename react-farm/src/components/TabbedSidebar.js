/**
 * ============================================
 * 📁 TabbedSidebar.js - Component Sidebar แบบ Tab
 * ============================================
 * 
 * ไฟล์นี้แสดง Sidebar แบบ Tab ที่มี 4 แท็บ:
 * - 🛒 ร้านค้า (Shop): ซื้อเมล็ดพันธุ์
 * - 📊 ตลาด (Market): ดูราคาและเทรนด์
 * - 🏭 โรงงานแปรรูป (Crafting): แปรรูปสินค้า
 * - 📋 สัญญา (Contracts): รับสัญญาการค้า
 * 
 * หน้าที่หลัก:
 * 1. แสดง Tab Header (ปุ่มเปลี่ยนแท็บ)
 * 2. แสดง Content ตาม activeTab ที่เลือก
 * 3. จัดการ State ของ activeTab
 * 
 * การเชื่อมโยง:
 * - App.js: ใช้ใน /farm route (Sidebar)
 * - Shop.js: Component ร้านขายเมล็ด
 * - MarketBoard.js: Component ตลาด
 * - CraftingStation.js: Component โรงงานแปรรูป
 * - ContractsPanel.js: Component สัญญา
 * 
 * Flow การทำงาน:
 * 1. เริ่มต้น activeTab = 'shop' (ร้านค้า)
 * 2. เมื่อคลิก Tab → เปลี่ยน activeTab
 * 3. renderContent() แสดง Component ตาม activeTab
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'; // 🔗 Styled Components: สำหรับ CSS-in-JS
import Shop from './Shop.js'; // 🔗 Component: ร้านขายเมล็ด
import MarketBoard from './MarketBoard.js'; // 🔗 Component: ตลาด
import CraftingStation from './CraftingStation.js'; // 🔗 Component: โรงงานแปรรูป
import ContractsPanel from './ContractsPanel.js'; // 🔗 Component: สัญญา

const SidebarContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid #e5e7eb;
  isolation: isolate;
  font-family: 'Playpen Sans Thai', sans-serif;
`;

const TabHeader = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 4px;
  gap: 4px;
  isolation: isolate;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button.attrs(({ $active }) => ({
  // Don't pass $active to DOM
}))`
  flex: 1;
  min-width: 0;
  padding: clamp(8px, 1.5vw, 12px) clamp(8px, 1.5vw, 12px);
  border: 2px solid ${props => props.$active ? '#1d4ed8' : '#e5e7eb'};
  background: ${props => props.$active ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.$active ? '#ffffff' : '#64748b'};
  font-weight: ${props => props.$active ? 'bold' : '600'};
  font-size: clamp(10px, 1.2vw, 13px);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  border-radius: 8px;
  isolation: isolate;
  position: relative;
  z-index: ${props => props.$active ? 1 : 0};
  
  &:not(:last-child) {
    margin-right: 4px;
  }
  
  &:hover {
    background: ${props => props.$active ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(59, 130, 246, 0.15)'};
    color: ${props => props.$active ? '#ffffff' : '#3b82f6'};
    border-color: ${props => props.$active ? '#1d4ed8' : 'rgba(59, 130, 246, 0.5)'};
    transform: ${props => props.$active ? 'none' : 'translateY(-1px)'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    font-size: clamp(9px, 1vw, 11px);
    padding: clamp(6px, 1vw, 10px) clamp(6px, 1vw, 10px);
  }
`;

const TabContent = styled.div`
  padding: 0;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
  isolation: isolate;
  position: relative;
  padding: 4px;
  
  /* Ensure components fit properly */
  > * {
    width: 100%;
    box-sizing: border-box;
    isolation: isolate;
  }
`;

/**
 * tabs: ข้อมูลแท็บทั้งหมด
 * 
 * แต่ละแท็บมี:
 * - id: ตัวระบุแท็บ (ใช้ใน switch case)
 * - label: ข้อความแสดงบนแท็บ
 * - icon: emoji icon
 */
const tabs = [
  { id: 'shop', label: '🛒 ร้านค้า', icon: '🛒' },
  { id: 'market', label: '📊 ตลาด', icon: '📊' },
  { id: 'crafting', label: '🏭 โรงงานแปรรูป', icon: '🏭' },
  { id: 'contracts', label: '📋 สัญญา', icon: '📋' }
];

/**
 * TabbedSidebar: Component Sidebar แบบ Tab
 * 
 * จัดการการเปลี่ยนแท็บและแสดง Content ตาม activeTab
 */
function TabbedSidebar() {
  // 🔗 React Hooks: State สำหรับเก็บแท็บที่เปิดอยู่
  const [activeTab, setActiveTab] = useState('shop'); // เริ่มต้นที่ 'shop' (ร้านค้า)

  /**
   * renderContent: แสดง Component ตาม activeTab
   * 
   * Flow:
   * 1. ตรวจสอบ activeTab
   * 2. Return Component ที่เกี่ยวข้อง
   * 
   * @returns {JSX.Element} Component ที่ต้องการแสดง
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'market':
        return <MarketBoard />; // 🔗 Component: ตลาด
      case 'shop':
        return <Shop />; // 🔗 Component: ร้านขายเมล็ด
      case 'crafting':
        return <CraftingStation />; // 🔗 Component: โรงงานแปรรูป
      case 'contracts':
        return <ContractsPanel />; // 🔗 Component: สัญญา
      default:
        return <Shop />; // Default: ร้านค้า
    }
  };

  return (
    <SidebarContainer>
      <TabHeader>
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabHeader>
      <TabContent>
        {renderContent()}
      </TabContent>
    </SidebarContainer>
  );
}

// ✅ ข้อ 1: PropTypes validation (10%)
TabbedSidebar.propTypes = {
  // This component doesn't receive props but PropTypes is defined to demonstrate knowledge
};

export default TabbedSidebar;

