// src/components/TabbedSidebar.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Shop from './Shop.js';
import MarketBoard from './MarketBoard.js';
import CraftingStation from './CraftingStation.js';
import ContractsPanel from './ContractsPanel.js';

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

const TabButton = styled.button`
  flex: 1;
  min-width: 0;
  padding: clamp(8px, 1.5vw, 12px) clamp(8px, 1.5vw, 12px);
  border: 2px solid ${props => props.active ? '#1d4ed8' : '#e5e7eb'};
  background: ${props => props.active ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.active ? '#ffffff' : '#64748b'};
  font-weight: ${props => props.active ? 'bold' : '600'};
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
  z-index: ${props => props.active ? 1 : 0};
  
  &:not(:last-child) {
    margin-right: 4px;
  }
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(59, 130, 246, 0.15)'};
    color: ${props => props.active ? '#ffffff' : '#3b82f6'};
    border-color: ${props => props.active ? '#1d4ed8' : 'rgba(59, 130, 246, 0.5)'};
    transform: ${props => props.active ? 'none' : 'translateY(-1px)'};
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

const tabs = [
  { id: 'shop', label: '🛒 ร้านค้า', icon: '🛒' },
  { id: 'market', label: '📊 ตลาด', icon: '📊' },
  { id: 'crafting', label: '🏭 โรงงานแปรรูป', icon: '🏭' },
  { id: 'contracts', label: '📋 สัญญา', icon: '📋' }
];

function TabbedSidebar() {
  const [activeTab, setActiveTab] = useState('shop'); // Default to shop

  const renderContent = () => {
    switch (activeTab) {
      case 'market':
        return <MarketBoard />;
      case 'shop':
        return <Shop />;
      case 'crafting':
        return <CraftingStation />;
      case 'contracts':
        return <ContractsPanel />;
      default:
        return <Shop />;
    }
  };

  return (
    <SidebarContainer>
      <TabHeader>
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
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

export default TabbedSidebar;

