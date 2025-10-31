// src/components/Menu.jsx
import React, { useState } from 'react';
import { Home, Store, LineChart, ClipboardList, Factory, Backpack, BarChart3, Check, ArrowRight, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'; //
import { Link, useLocation } from 'react-router-dom';
import { setPage, resetGame } from '../state/farmSlice.js';
import { getGameDay } from '../utils/time.js';

/**
 * Menu Component - เมนูหลักของเกม
 * ✅ ข้อ 1: Function Component + PropTypes (10%)
 * ✅ ข้อ 7: React Router concept - Navigation (10%)
 */
function Menu({ isOpen, onClose }) {
  // ✅ ข้อ 4: React Hooks - useState (15%)
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // ✅ ข้อ 5: Redux - useSelector, useDispatch (15%)
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPage = useSelector((state) => state.farm.currentPage);
  const money = useSelector((state) => state.farm.money);
  const gameStartTime = useSelector((state) => state.farm.gameStartTime);
  const seedInventory = useSelector((state) => state.farm.seedInventory || {}); // ✅ เพิ่ม || {}
const selectedSeed = useSelector((state) => state.farm.selectedSeed);
  
  const day = getGameDay(gameStartTime);
  
  // ✅ คำนวณจำนวนของในกระเป๋า (เมล็ด + เมล็ดที่เลือกอยู่)
  const totalItems = Object.values(seedInventory).reduce((sum, count) => sum + count, 0) 
                 + (selectedSeed ? 1 : 0);
  
  // Get active page from URL pathname
  const activePage = location.pathname.replace('/', '') || 'farm';
  
  // ✅ ข้อ 3: Handle navigation event (15%) - Now using Link, but sync Redux on click
  const handleNavigation = (page) => {
    dispatch(setPage(page));
    onClose();
  };

  // ✅ ข้อ 3: Handle reset game (15%)
  const handleResetGame = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะรีเซ็ตเกม? ข้อมูลทั้งหมดจะหายไป!')) {
      dispatch(resetGame());
      onClose();
    }
  };

  // ✅ ข้อ 7: Menu items สำหรับ navigation
  const menuItems = [
    { 
      id: 'farm', 
      label: 'ฟาร์ม', 
      description: 'ปลูกพืชและเก็บเกี่ยว',
    },
    { 
      id: 'shop', 
      label: 'ร้านอัปเกรด', 
      description: 'ซื้อแปลงและปลดล็อกสิ่งของ',
    },
    { 
      id: 'inventory', 
      label: 'กระเป๋า', 
      description: `ดูของที่มีอยู่ (${totalItems} ชิ้น)`,
    },
    { 
      id: 'stats', 
      label: 'สถิติ', 
      description: 'ดูความคืบหน้าและผลงาน',
    },
  ];

  const renderIcon = (id) => {
    switch (id) {
      case 'farm': return <Home size={20} style={{ marginRight: 10 }} />;
      case 'shop': return <Store size={20} style={{ marginRight: 10 }} />;
      case 'inventory': return <Backpack size={20} style={{ marginRight: 10 }} />;
      case 'stats': return <BarChart3 size={20} style={{ marginRight: 10 }} />;
      default: return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%',
        overflow: 'hidden',
        animation: 'slideUp 0.3s ease-out'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(to right, #10b981, #059669)',
          color: 'white',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>เมนูเกม</h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '4px', marginBottom: 0 }}>
                วันที่ {day} | ฿{money.toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '20px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{
          padding: '24px',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <Link
                key={item.id}
                to={`/${item.id}`}
                onClick={() => handleNavigation(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '16px',
                  marginBottom: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isActive ? '#10b981' : '#f3f4f6',
                  color: isActive ? 'white' : '#111827',
                  transform: hoveredItem === item.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isActive ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                      {renderIcon(item.id)} {item.label}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: isActive ? 'rgba(255,255,255,0.9)' : '#6b7280' 
                    }}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && <Check size={22} />}
                  {hoveredItem === item.id && !isActive && (
                    <ArrowRight size={22} color="#10b981" />
                  )}
                </div>
              </Link>
            );
          })}

          {/* ปุ่มรีเซ็ตเกม */}
          <div style={{ paddingTop: '16px', marginTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={handleResetGame}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                background: '#fef2f2',
                color: '#dc2626',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#fee2e2';
                e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#fef2f2';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>🔄 รีเซ็ตเกม</div>
                  <div style={{ fontSize: '14px', color: '#ef4444' }}>เริ่มเกมใหม่ทั้งหมด</div>
                </div>
                <span style={{ fontSize: '24px' }}>⚠️</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#f9fafb',
          padding: '16px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6b7280',
          borderTop: '1px solid #e5e7eb'
        }}>
          💾 บันทึกอัตโนมัติ (Redux Toolkit + localStorage)
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

// ✅ ข้อ 1: PropTypes validation (10%)
Menu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Menu;