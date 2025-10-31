// src/components/StatusBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Wallet, Calendar as CalendarIcon, Sun, Moon, HelpCircle, Menu as MenuIcon, Music as MusicIcon, VolumeX } from 'lucide-react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'; // ✅ ข้อ 5: useSelector (15%)
import { getDayNightCycle, getGameDay, getTimeOfDay, formatRealTime, getGameTime } from "../utils/time.js";
import state from '../state/store.js';

/**
 * StatusBar Component - แสดงสถานะเงิน วัน เวลา
 * ✅ ข้อ 1: Function Component + PropTypes (10%)
 */
function StatusBar({ onMenuClick, onHelpClick }) {
  // ✅ ข้อ 4: React Hooks - useState (15%)
  const [dayNight, setDayNight] = useState("day");
  const [gameDay, setGameDay] = useState(1);
  const [realTime, setRealTime] = useState(new Date());
  const [isMoneyAnimating, setIsMoneyAnimating] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  
  // ✅ ข้อ 5: useSelector จาก Redux (15%)
  const money = useSelector((state) => state.farm.money);
  const level = useSelector((state) => state.farm.level);
  const xp = useSelector((state) => state.farm.xp);
  const maxXp = useSelector((state) => state.farm.maxXp);
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

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isMusicPlaying) {
        audio.pause();
        setIsMusicPlaying(false);
      } else {
        audio.volume = 0.35;
        await audio.play();
        setIsMusicPlaying(true);
      }
    } catch (e) {
      // เงียบไว้ถ้าเบราว์เซอร์บล็อก autoplay
    }
  };

  // กำหนดสีเงินตามจำนวน
  const getMoneyColor = () => {
    if (money < 10) return '#dc2626';   // Dark red - critical/danger
    if (money < 20) return '#f97316';   // Orange - low warning
    if (money < 50) return '#f59e0b';   // Amber - caution
    if (money < 100) return '#eab308';  // Yellow - getting better
    if (money < 200) return '#84cc16';  // Lime - good
    return '#22c55e';                    // Green - wealthy
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
      padding: '8px 0',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* Hidden audio element for background music */}
      <audio
        ref={audioRef}
        src="/ConcernedApe-Stardew-Valley-OST.mp3"
        loop
        preload="auto"
        style={{ display: 'none' }}
      />
      <div style={{
        width: '90%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        rowGap: '8px'
      }}>
        
        {/* LEFT: Farm Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: '0 1 auto',
          minWidth: 'fit-content'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: window.innerWidth <= 1245 ? '16px' : '20px',
            fontWeight: 'bold',
            color: 'white',
            whiteSpace: 'nowrap'
          }}>
            🌾 Cozy Farm Life 🌿
          </h1>
        </div>

        {/* MIDDLE: Stats */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: window.innerWidth <= 1245 ? '6px' : '12px',
          flex: '3 1 auto',
          justifyContent: 'center',
          flexWrap: 'wrap',
          minWidth: window.innerWidth <= 1245 ? '300px' : '500px'
        }}>
          {/* 🧪 Level & XP */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(255,255,255,0.2)',
          padding: window.innerWidth <= 1245 ? '6px 12px' : '3px 16px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          minWidth: window.innerWidth <= 1245 ? '120px' : '160px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '100%',
            marginBottom: '2px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: window.innerWidth <= 1245 ? '12px' : '14px'
            }}>
              <span>Lv {level}</span>
              <span>{xp}/{maxXp}</span>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.3)',
              height: '6px',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, (xp / (maxXp || 1)) * 100))}%`,
                background: 'linear-gradient(90deg, #a7f3d0, #34d399)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        </div>
          {/* 💰 เงิน */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          background: 'rgba(255,255,255,0.2)',
          padding: window.innerWidth <= 1245 ? '6px 12px' : '8px 16px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s',
          transform: isMoneyAnimating ? 'scale(1.1)' : 'scale(1)',
          backgroundColor: isMoneyAnimating ? 'rgba(250,204,21,0.4)' : 'rgba(255,255,255,0.2)',
          minWidth: window.innerWidth <= 1245 ? '80px' : '110px'
        }}>
          <Wallet size={window.innerWidth <= 1245 ? 14 : 18} />
          <div style={{ fontSize: window.innerWidth <= 1245 ? '12px' : '15px', fontWeight: 'bold', color: getMoneyColor() }}>
            ฿{money ? money.toLocaleString() : 0}
          </div>
        </div>

        {/* 📅 วันที่ */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          background: 'rgba(255,255,255,0.2)',
          padding: window.innerWidth <= 1245 ? '6px 12px' : '8px 16px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          minWidth: window.innerWidth <= 1245 ? '80px' : '110px'
        }}>
          <CalendarIcon size={window.innerWidth <= 1245 ? 14 : 18} />
          <div style={{ fontSize: window.innerWidth <= 1245 ? '12px' : '15px', fontWeight: 'bold' }}>
            วันที่ {gameDay}
          </div>
        </div>

         {/* 🌅 เวลาในเกม */}
         <div style={{
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           gap: '6px',
           background: 'rgba(255,255,255,0.2)',
           padding: window.innerWidth <= 1245 ? '6px 12px' : '8px 16px',
           borderRadius: '8px',
           backdropFilter: 'blur(10px)',
           minWidth: window.innerWidth <= 1245 ? '80px' : '110px'
         }}>
           {dayNight === 'night' ? <Moon size={window.innerWidth <= 1245 ? 14 : 18} /> : <Sun size={window.innerWidth <= 1245 ? 14 : 18} />}
           <div style={{ fontSize: window.innerWidth <= 1245 ? '12px' : '15px', fontWeight: 'bold' }}>
             {String(gameHour).padStart(2, '0')}:{String(gameMinute).padStart(2, '0')}
           </div>
         </div>
        </div>

        {/* RIGHT: Control Buttons */}
        <div style={{
          display: 'flex',
          gap: window.innerWidth <= 1245 ? '4px' : '8px',
          flex: '0 1 auto',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          {/* 🎵 ปุ่มเปิด/ปิดเพลง */}
          <button
            onClick={toggleMusic}
            title={isMusicPlaying ? 'หยุดเพลง' : 'เล่นเพลง'}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: window.innerWidth <= 1245 ? '6px 10px' : '8px 12px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)',
              fontSize: window.innerWidth <= 1245 ? '12px' : '14px'
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
            {isMusicPlaying ? <MusicIcon size={window.innerWidth <= 1245 ? 14 : 18} style={{ verticalAlign: 'middle' }} /> : <VolumeX size={window.innerWidth <= 1245 ? 14 : 18} style={{ verticalAlign: 'middle' }} />}
          </button>
          {/* 📚 ปุ่มช่วยเหลือ */}
          <button
            onClick={onHelpClick}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: window.innerWidth <= 1245 ? '6px 10px' : '8px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)',
              fontSize: window.innerWidth <= 1245 ? '12px' : '14px'
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
            <HelpCircle size={window.innerWidth <= 1245 ? 14 : 18} style={{ verticalAlign: 'middle', marginRight: window.innerWidth <= 1245 ? 4 : 6 }} /> ช่วยเหลือ
          </button>
          
          {/* 📋 ปุ่มเมนู */}
          <button
            onClick={onMenuClick}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: window.innerWidth <= 1245 ? '6px 10px' : '8px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)',
              fontSize: window.innerWidth <= 1245 ? '12px' : '14px'
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
            <MenuIcon size={window.innerWidth <= 1245 ? 14 : 18} style={{ verticalAlign: 'middle', marginRight: window.innerWidth <= 1245 ? 4 : 6 }} /> เมนู
          </button>
          
        </div>
      </div>
    </div>
  );
}

// ✅ ข้อ 1: PropTypes validation (10%)
StatusBar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  onHelpClick: PropTypes.func.isRequired,
};

export default StatusBar;