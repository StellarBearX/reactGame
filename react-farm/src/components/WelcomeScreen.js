/**
 * ============================================
 * 📁 WelcomeScreen.js - Component หน้าต้อนรับ
 * ============================================
 * 
 * ไฟล์นี้แสดงหน้าต้อนรับสำหรับผู้เล่นใหม่ (Tutorial/Onboarding)
 * 
 * หน้าที่หลัก:
 * 1. แสดง Tutorial Steps (7 ขั้นตอน)
 * 2. จัดการการเปลี่ยนขั้นตอน (Next/Previous/Skip)
 * 3. แสดง Progress Bar
 * 4. เริ่มเกมเมื่อกด "เริ่มเล่น"
 * 
 * การเชื่อมโยง:
 * - App.js: ใช้แสดงเมื่อยังไม่เห็น Welcome Screen
 * - farmSlice.js: เรียกใช้ markWelcomeSeen action
 * - lucide-react: Icons สำหรับแต่ละขั้นตอน
 * 
 * Props:
 * - onStartGame: function - ฟังก์ชันเริ่มเกม (ปิด Welcome Screen)
 * 
 * Tutorial Steps:
 * 1. ยินดีต้อนรับ
 * 2. การปลูกพืช
 * 3. การเก็บเกี่ยว
 * 4. ตลาดและราคา
 * 5. สัญญาและงาน
 * 6. โรงงานแปรรูป
 * 7. พร้อมเริ่มเล่น
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Hand, Sprout, Wheat, LineChart, ClipboardList, Factory, Gamepad2 } from 'lucide-react'; // 🔗 Icon Library
import { useDispatch } from 'react-redux'; // 🔗 Redux Hook
import { setPage } from '../state/farmSlice.js'; // 🔗 Redux Action

/**
 * WelcomeScreen: Component หน้าต้อนรับ
 * 
 * @param {Function} onStartGame - ฟังก์ชันเริ่มเกม
 */
function WelcomeScreen({ onStartGame }) {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: "ยินดีต้อนรับสู่ Cozy Farm Life!",
      content: "เกมจำลองการทำฟาร์มที่คุณสามารถปลูกพืช เก็บเกี่ยว และสร้างรายได้",
      color: {
        primary: "#10b981",
        secondary: "#059669"
      }
    },
    {
      title: "การปลูกพืช",
      content: "1. ไปที่ร้านค้าเพื่อซื้อเมล็ดพันธุ์\n2. เลือกเมล็ดที่ต้องการ\n3. คลิกที่แปลงว่างเพื่อปลูก\n4. รอให้พืชเติบโต",
      color: {
        primary: "#16a34a",
        secondary: "#15803d"
      }
    },
    {
      title: "การเก็บเกี่ยว",
      content: "เมื่อพืชเติบโตเต็มที่ (100%) คลิกที่แปลงเพื่อเก็บเกี่ยวและรับเงิน",
      color: {
        primary: "#f59e0b",
        secondary: "#d97706"
      }
    },
    {
      title: "ตลาดและราคา",
      content: "ราคาสินค้าเปลี่ยนแปลงทุกวันตามฤดูกาลและเหตุการณ์พิเศษ ตรวจสอบตลาดก่อนขาย!",
      color: {
        primary: "#3b82f6",
        secondary: "#2563eb"
      }
    },
    {
      title: "สัญญาและงาน",
      content: "รับสัญญาส่งสินค้าเพื่อรับรางวัลพิเศษ เงิน และ XP เพิ่มเติม",
      color: {
        primary: "#0ea5e9",
        secondary: "#0284c7"
      }
    },
    {
      title: "โรงงานแปรรูป",
      content: "แปรรูปสินค้าเป็นผลิตภัณฑ์ที่มีมูลค่าสูงกว่า เช่น แป้ง ซอสมะเขือเทศ พายฟักทอง",
      color: {
        primary: "#8b5cf6",
        secondary: "#7c3aed"
      }
    },
    {
      title: "พร้อมเริ่มเล่นแล้ว!",
      content: "กดปุ่มเริ่มเล่นเพื่อเข้าสู่โลกฟาร์มของคุณ",
      color: {
        primary: "#f97316",
        secondary: "#ea580c"
      }
    }
  ];
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartGame();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    onStartGame();
  };
  
  // Helper function to convert hex to rgba with opacity
  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  const currentTutorial = tutorialSteps[currentStep];
  const renderStepIcon = () => {
    switch (currentStep) {
      case 0: return <Hand size={64} />;
      case 1: return <Sprout size={64} />;
      case 2: return <Wheat size={64} />;
      case 3: return <LineChart size={64} />;
      case 4: return <ClipboardList size={64} />;
      case 5: return <Factory size={64} />;
      default: return <Gamepad2 size={64} />;
    }
  };
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%',
        overflow: 'hidden',
        animation: 'slideUp 0.3s ease-out'
      }}>
        
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${currentTutorial.color.primary} 0%, ${currentTutorial.color.primary}dd 100%)`,
          color: 'white',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '16px' }}>
            {renderStepIcon()}
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            margin: 0,
            marginBottom: '8px'
          }}>
            {currentTutorial.title}
          </h1>
        </div>
        
        {/* Content */}
        <div style={{
          padding: '30px',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#374151',
            whiteSpace: 'pre-line',
            textAlign: 'center'
          }}>
            {currentTutorial.content}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{
          padding: '0 30px 20px 30px'
        }}>
          <div style={{
            background: '#e5e7eb',
            borderRadius: '10px',
            height: '8px',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <div style={{
              background: currentTutorial.color.primary,
              height: '100%',
              width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
              transition: 'width 0.3s ease',
              borderRadius: '10px'
            }}></div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              {currentStep + 1} / {tutorialSteps.length}
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={handleSkip}
                style={{
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f3f4f6';
                }}
              >
                ข้าม
              </button>
              
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  style={{
                    background: hexToRgba(currentTutorial.color.secondary, 0.6),
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  กลับ
                </button>
              )}
              
              <button
                onClick={handleNext}
                style={{
                  background: currentTutorial.color.primary,
                  color: 'white',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {currentStep === tutorialSteps.length - 1 ? 'เริ่มเล่น' : 'ต่อไป'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
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

WelcomeScreen.propTypes = {
  onStartGame: PropTypes.func.isRequired
};

export default WelcomeScreen;
