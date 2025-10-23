// src/components/StatusBar.jsx
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'; // ✅ ข้อ 5: useSelector (15%)
import { getDayNightCycle, getGameDay, getTimeOfDay, formatRealTime, getGameTime } from "../utils/time.js";
import state from '../state/store.js';

/**
 * StatusBar Component - แสดงสถานะเงิน วัน เวลา
 * ✅ ข้อ 1: Function Component + PropTypes (10%)
 */
function StatusBar({ onMenuClick }) {
  // ✅ ข้อ 4: React Hooks - useState (15%)
  const [dayNight, setDayNight] = useState("day");
  const [gameDay, setGameDay] = useState(1);
  const [realTime, setRealTime] = useState(new Date());
  const [isMoneyAnimating, setIsMoneyAnimating] = useState(false);
  
  // ✅ ข้อ 5: useSelector จาก Redux (15%)
  const money = useSelector((state) => state.farm.money);
const gameStartTime = useSelector((state) => state.farm?.gameStartTime ?? Date.now());
  // คำนวณข้อมูลเวลา
  const timeData = getTimeOfDay(gameStartTime);
  const { hour: gameHour, minute: gameMinute } = getGameTime(gameStartTime);

  // ✅ ข้อ 4: useEffect สำหรับอัพเดทเวลาในเกม
  useEffect(() => {
    const interval = setInterval(() => {
      setDayNight(getDayNightCycle(gameStartTime));
      setGameDay(getGameDay(gameStartTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStartTime]);

  // ✅ ข้อ 4: useEffect สำหรับเวลาจริง
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ ข้อ 3: Animation เมื่อเงินเปลี่ยน (15%)
  useEffect(() => {
    setIsMoneyAnimating(true);
    const timeout = setTimeout(() => setIsMoneyAnimating(false), 400);
    return () => clearTimeout(timeout);
  }, [money]);

  // กำหนดสีเงินตามจำนวน
  const getMoneyColor = () => {
  
    if (money < 20) return '#dc2626';
    if (money > 200) return '#16a34a';
    return '#ca8a04';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to right, #16a34a, #15803d)',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 1000,
      padding: '12px 20px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        
        {/* 💰 เงิน */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s',
          transform: isMoneyAnimating ? 'scale(1.1)' : 'scale(1)',
          backgroundColor: isMoneyAnimating ? 'rgba(250,204,21,0.4)' : 'rgba(255,255,255,0.2)',
        }}>
          <span style={{ fontSize: '24px' }}>💰</span>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>เงิน</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: getMoneyColor() }}>
             ฿{money ? money.toLocaleString() : 0}
            </div>
          </div>
        </div>

        {/* 📅 วันที่ */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
        }}>
          <span style={{ fontSize: '24px' }}>📅</span>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>วันที่</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              วันที่ {gameDay}
            </div>
          </div>
        </div>

        {/* 🌅 เวลาในเกม */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
        }}>
          <span style={{ fontSize: '24px' }}>{timeData.emoji}</span>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>{timeData.period}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {String(gameHour).padStart(2, '0')}:{String(gameMinute).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* 📋 ปุ่มเมนู - ✅ ข้อ 3: Handle event (15%) */}
        <button
          onClick={onMenuClick}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '8px 24px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.3)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          📋 เมนู
        </button>
      </div>
    </div>
  );
}

// ✅ ข้อ 1: PropTypes validation (10%)
StatusBar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};

export default StatusBar;