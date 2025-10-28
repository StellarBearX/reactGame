// src/components/WelcomeScreen.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPage } from '../state/farmSlice.js';

function WelcomeScreen({ onStartGame }) {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: "🌾 ยินดีต้อนรับสู่ Cozy Farm Life!",
      content: "เกมจำลองการทำฟาร์มที่คุณสามารถปลูกพืช เก็บเกี่ยว และสร้างรายได้",
      emoji: "👋",
      color: "#10b981"
    },
    {
      title: "🌱 การปลูกพืช",
      content: "1. ไปที่ร้านค้าเพื่อซื้อเมล็ดพันธุ์\n2. เลือกเมล็ดที่ต้องการ\n3. คลิกที่แปลงว่างเพื่อปลูก\n4. รอให้พืชเติบโต",
      emoji: "🌱",
      color: "#16a34a"
    },
    {
      title: "🌾 การเก็บเกี่ยว",
      content: "เมื่อพืชเติบโตเต็มที่ (100%) คลิกที่แปลงเพื่อเก็บเกี่ยวและรับเงิน",
      emoji: "🌾",
      color: "#f59e0b"
    },
    {
      title: "📊 ตลาดและราคา",
      content: "ราคาสินค้าเปลี่ยนแปลงทุกวันตามฤดูกาลและเหตุการณ์พิเศษ ตรวจสอบตลาดก่อนขาย!",
      emoji: "📊",
      color: "#3b82f6"
    },
    {
      title: "📋 สัญญาและงาน",
      content: "รับสัญญาส่งสินค้าเพื่อรับรางวัลพิเศษ เงิน และ XP เพิ่มเติม",
      emoji: "📋",
      color: "#0ea5e9"
    },
    {
      title: "🏭 โรงงานแปรรูป",
      content: "แปรรูปสินค้าเป็นผลิตภัณฑ์ที่มีมูลค่าสูงกว่า เช่น แป้ง ซอสมะเขือเทศ พายฟักทอง",
      emoji: "🏭",
      color: "#8b5cf6"
    },
    {
      title: "🎮 พร้อมเริ่มเล่นแล้ว!",
      content: "กดปุ่มเริ่มเล่นเพื่อเข้าสู่โลกฟาร์มของคุณ",
      emoji: "🎮",
      color: "#f97316"
    }
  ];
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartGame();
    }
  };
  
  const handleSkip = () => {
    onStartGame();
  };
  
  const currentTutorial = tutorialSteps[currentStep];
  
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
          background: `linear-gradient(135deg, ${currentTutorial.color} 0%, ${currentTutorial.color}dd 100%)`,
          color: 'white',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '16px'
          }}>
            {currentTutorial.emoji}
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
              background: currentTutorial.color,
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
              
              <button
                onClick={handleNext}
                style={{
                  background: currentTutorial.color,
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

export default WelcomeScreen;
