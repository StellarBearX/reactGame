/**
 * ============================================
 * 📁 HelpPanel.js - Component คู่มือช่วยเหลือ
 * ============================================
 * 
 * ไฟล์นี้แสดงคู่มือช่วยเหลือแบบ Modal สำหรับผู้เล่น
 * 
 * หน้าที่หลัก:
 * 1. แสดงคู่มือการเล่นแยกเป็น Tab (4 Tab)
 * 2. แสดงขั้นตอนและคำแนะนำในแต่ละหมวด
 * 3. จัดการการเปลี่ยน Tab
 * 
 * การเชื่อมโยง:
 * - App.js: ใช้เป็น Modal (props: isOpen, onClose)
 * - StatusBar.js: เรียกเปิด HelpPanel เมื่อกดปุ่มช่วยเหลือ
 * 
 * Props:
 * - isOpen: boolean - เปิด/ปิด Help Panel
 * - onClose: function - ฟังก์ชันปิด Help Panel
 * 
 * Help Sections (Tabs):
 * 1. 🌱 พื้นฐานการเล่น: การปลูกพืช, เก็บเกี่ยว, ซื้อขาย
 * 2. 💰 ระบบเศรษฐกิจ: ตลาด Dynamic, สัญญา, โรงงานแปรรูป
 * 3. 📈 การพัฒนา: ระบบเลเวล, สถิติ, เคล็ดลับ
 * 4. 🎮 การควบคุม: เมนูหลัก, การบันทึกเกม
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * HelpPanel: Component คู่มือช่วยเหลือ
 * 
 * @param {boolean} isOpen - เปิด/ปิด Help Panel
 * @param {Function} onClose - ฟังก์ชันปิด Help Panel
 */
function HelpPanel({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('basics');
  
  const helpSections = {
    basics: {
      title: '🌱 พื้นฐานการเล่น',
      icon: '🌱',
      content: [
        {
          title: 'การปลูกพืช',
          steps: [
            'ไปที่ร้านค้า (🏪 ร้านค้า)',
            'ซื้อเมล็ดพันธุ์ที่ต้องการ',
            'เลือกเมล็ดจากกระเป๋า (🎒 กระเป๋า)',
            'คลิกที่แปลงว่างเพื่อปลูก',
            'รอให้พืชเติบโตตามเวลาที่กำหนด'
          ]
        },
        {
          title: 'การเก็บเกี่ยว',
          steps: [
            'เมื่อพืชเติบโตเต็มที่ (100%)',
            'คลิกที่แปลงเพื่อเก็บเกี่ยว',
            'รับเงินและ XP',
            'พืชจะหายไปและแปลงจะว่าง'
          ]
        },
        {
          title: 'การซื้อขาย',
          steps: [
            'ตรวจสอบราคาในตลาด (📊 ตลาด)',
            'ราคาเปลี่ยนแปลงทุกวันตามฤดูกาล',
            'เก็บผลผลิตไว้ขายเมื่อราคาสูง',
            'ติดตามเหตุการณ์พิเศษที่ส่งผลต่อราคา'
          ]
        }
      ]
    },
    
    economy: {
      title: '💰 ระบบเศรษฐกิจ',
      icon: '💰',
      content: [
        {
          title: 'ตลาดแบบ Dynamic',
          steps: [
            'ราคาเปลี่ยนแปลงทุกวัน (60 วินาที = 1 วันในเกม)',
            'ฤดูกาลส่งผลต่อราคา: Spring, Summer, Autumn, Winter',
            'เหตุการณ์สุ่มส่งผลต่อราคา เช่น ขาดแคลนมะเขือเทศ',
            'ตรวจสอบเทรนด์ราคาก่อนขายสินค้า'
          ]
        },
        {
          title: 'สัญญาและงาน',
          steps: [
            'รับสัญญาส่งสินค้าจากหน้าสัญญา (📋 สัญญา)',
            'สัญญาใหม่ปรากฏทุก 5 นาที (สูงสุด 3 สัญญา)',
            'ส่งมอบสินค้าตามจำนวนที่กำหนด',
            'รับรางวัล: เงิน, XP, เมล็ดพันธุ์พิเศษ'
          ]
        },
        {
          title: 'โรงงานแปรรูป',
          steps: [
            'ปลดล็อกโรงสีที่เลเวล 3',
            'ปลดล็อกครัวที่เลเวล 5',
            'ปลดล็อกโรงงานที่เลเวล 8',
            'แปรรูปสินค้าเป็นผลิตภัณฑ์มูลค่าสูง'
          ]
        }
      ]
    },
    
    progression: {
      title: '📈 การพัฒนา',
      icon: '📈',
      content: [
        {
          title: 'ระบบเลเวล',
          steps: [
            'ได้รับ XP จากการปลูกและเก็บเกี่ยว',
            'เลเวลอัพเพิ่มพื้นที่เพาะปลูก',
            'เลเวลสูงปลดล็อกฟีเจอร์ใหม่',
            'เลเวล 10: เพิ่มแปลงเพาะปลูก'
          ]
        },
        {
          title: 'สถิติและความสำเร็จ',
          steps: [
            'ดูสถิติในหน้าสถิติ (📊 สถิติ)',
            'ติดตามผลงาน: ปลูก, เก็บเกี่ยว, รายได้',
            'เป้าหมายระยะยาว: สร้างฟาร์มที่ใหญ่ขึ้น',
            'ลองเล่นทุกฟีเจอร์เพื่อความสนุก'
          ]
        },
        {
          title: 'เคล็ดลับการเล่น',
          steps: [
            'วางแผนการปลูกตามราคาตลาด',
            'เก็บผลผลิตไว้ขายเมื่อราคาสูง',
            'รับสัญญาเพื่อรายได้ที่แน่นอน',
            'แปรรูปสินค้าเพื่อเพิ่มมูลค่า'
          ]
        }
      ]
    },
    
    controls: {
      title: '🎮 การควบคุม',
      icon: '🎮',
      content: [
        {
          title: 'เมนูหลัก',
          steps: [
            'คลิกปุ่มเมนู (📋 เมนู) ที่มุมขวาบน',
            'เลือกหน้าที่ต้องการ: ฟาร์ม, ร้านค้า, ตลาด, สัญญา, โรงงาน, กระเป๋า, สถิติ',
            'ใช้เมนูเพื่อสลับระหว่างหน้าต่างๆ',
            'ปุ่มรีเซ็ตเกมอยู่ด้านล่างเมนู'
          ]
        },
        {
          title: 'การบันทึกเกม',
          steps: [
            'เกมบันทึกอัตโนมัติทุกครั้งที่มีการเปลี่ยนแปลง',
            'ข้อมูลเกมเก็บใน localStorage ของเบราว์เซอร์',
            'ปิดเบราว์เซอร์แล้วเปิดใหม่ข้อมูลจะยังอยู่',
            'กดรีเซ็ตเกมเพื่อเริ่มใหม่ทั้งหมด'
          ]
        }
      ]
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
      padding: '16px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
        animation: 'slideUp 0.3s ease-out'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(to right, #10b981, #059669)',
          color: 'white',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                margin: 0
              }}>
                📚 คู่มือการเล่น
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.9)',
                marginTop: '4px',
                marginBottom: 0
              }}>
                เรียนรู้วิธีการเล่น Cozy Farm Life
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
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {Object.entries(helpSections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                background: activeTab === key ? 'white' : 'transparent',
                color: activeTab === key ? '#10b981' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                borderBottom: activeTab === key ? '3px solid #10b981' : '3px solid transparent'
              }}
            >
              <span style={{ marginRight: '8px' }}>{section.icon}</span>
              {section.title}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div style={{
          padding: '24px',
          maxHeight: '50vh',
          overflowY: 'auto'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {helpSections[activeTab].icon} {helpSections[activeTab].title}
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {helpSections[activeTab].content.map((item, index) => (
              <div key={index} style={{
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  {item.title}
                </h4>
                <ol style={{
                  margin: 0,
                  paddingLeft: '20px',
                  color: '#6b7280',
                  lineHeight: '1.6'
                }}>
                  {item.steps.map((step, stepIndex) => (
                    <li key={stepIndex} style={{
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
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
          💡 เคล็ดลับ: กดปุ่มเมนูเพื่อสลับระหว่างหน้าต่างๆ ได้ตลอดเวลา
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

HelpPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default HelpPanel;
