/**
 * ============================================
 * 📁 MarketBoard.js - Component ตลาด (Market Board)
 * ============================================
 * 
 * ไฟล์นี้แสดงข้อมูลตลาด Dynamic Market ที่ราคาเปลี่ยนแปลงตามฤดูกาลและเหตุการณ์
 * 
 * หน้าที่หลัก:
 * 1. แสดงราคาสินค้าทั้งหมด (ราคาปัจจุบัน, ราคาพื้นฐาน, เทรนด์)
 * 2. อัพเดทราคาทุกวันในเกม (ทุก 60 วินาที)
 * 3. แสดงฤดูกาลปัจจุบัน (Spring, Summer, Autumn, Winter)
 * 4. แสดงเหตุการณ์พิเศษ (Events) ที่ส่งผลต่อราคา
 * 5. สร้างเหตุการณ์สุ่ม (30% โอกาส, สูงสุด 2 เหตุการณ์)
 * 6. ดึงข้อมูลราคาจาก API (ถ้ามี)
 * 7. อัพเดทราคาทันทีเมื่อเหตุการณ์เปลี่ยน (Dynamic Pricing)
 * 
 * การเชื่อมโยง:
 * - TabbedSidebar.js: ใช้ใน Tab 'market'
 * - farmSlice.js: เรียกใช้ updateMarketPrices, addMarketEvent, removeMarketEvent actions
 * - market.js: ใช้คำนวณราคา (calculateCurrentPrices, calculatePriceTrend, generateRandomEvent)
 * - crops.js: ดึงข้อมูลพืชทั้งหมด (CROPS_DATA)
 * - time.js: คำนวณวันในเกม (getGameDay)
 * - useMarketAPI.js: Custom Hook สำหรับดึงข้อมูลราคาจาก API
 * - Redux Store: ดึงข้อมูล gameStartTime, market, level
 * 
 * Flow การทำงาน:
 * 1. อัพเดทราคาทุกวันในเกม (60 วินาที = 1 วัน)
 * 2. สร้างเหตุการณ์สุ่ม (30% โอกาส, สูงสุด 2 เหตุการณ์)
 * 3. อัพเดทราคาทันทีเมื่อเหตุการณ์เปลี่ยน
 * 4. แสดงราคา เทรนด์ (up/down/stable) และเปอร์เซ็นต์การเปลี่ยนแปลง
 */

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // 🔗 Redux Hooks
import { updateMarketPrices, addMarketEvent, removeMarketEvent } from '../state/farmSlice.js'; // 🔗 Redux Actions
import { calculateCurrentPrices, getCurrentSeason, generateRandomEvent, calculatePriceTrend, MARKET_EVENTS } from '../data/market.js'; // 🔗 Market Data & Functions
import { CROPS_DATA } from '../data/crops.js'; // 🔗 ข้อมูลพืชทั้งหมด
import { getGameDay } from '../utils/time.js'; // 🔗 Utility: คำนวณวันในเกม
import { useMarketAPI } from '../hooks/useMarketAPI.js'; // 🔗 Custom Hook: ดึงข้อมูลราคาจาก API

/**
 * MarketBoard: Component ตลาด (Market Board)
 * 
 * แสดงราคาสินค้าทั้งหมด พร้อมเทรนด์และเหตุการณ์พิเศษ
 */
function MarketBoard() {
  const dispatch = useDispatch();
  const gameStartTime = useSelector((state) => state.farm.gameStartTime);
  const market = useSelector((state) => state.farm.market);
  const level = useSelector((state) => state.farm.level);
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentDay = getGameDay(gameStartTime);
  
  // ✅ GET method - Fetch market data from API via custom hook
  const { marketData: apiMarketData, loading: marketLoading } = useMarketAPI(currentDay, market.activeEvents);
  
  // อัพเดทราคาตลาดทุกวัน
  useEffect(() => {
    const shouldUpdatePrices = !market.lastPriceUpdate || 
      (Date.now() - market.lastPriceUpdate) > (60 * 1000); // อัพเดททุก 60 วินาที (1 วันในเกม)
    
    if (shouldUpdatePrices) {
      // Always recalculate prices with current activeEvents to ensure dynamic pricing works
      const marketData = calculateCurrentPrices(currentDay, market.activeEvents);
      const trends = calculatePriceTrend(marketData.prices, market.previousPrices);
      
      dispatch(updateMarketPrices({
        prices: marketData.prices,
        season: marketData.season,
        activeEvents: market.activeEvents,
        trends
      }));
    }
  }, [currentDay, dispatch, market.lastPriceUpdate, market.activeEvents, market.previousPrices]);
  
  // อัพเดทราคาทันทีเมื่อ activeEvents เปลี่ยน (สำหรับ dynamic pricing)
  useEffect(() => {
    // Skip if prices not initialized yet (wait for main update)
    if (!market.currentPrices || Object.keys(market.currentPrices).length === 0) {
      return;
    }
    
    // Recalculate prices with current activeEvents when events change
    const marketData = calculateCurrentPrices(currentDay, market.activeEvents);
    const trends = calculatePriceTrend(marketData.prices, market.previousPrices);
    
    dispatch(updateMarketPrices({
      prices: marketData.prices,
      season: marketData.season,
      activeEvents: market.activeEvents,
      trends
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market.activeEvents]); // Only trigger when events change
  
  // สร้างเหตุการณ์สุ่ม
  useEffect(() => {
    const shouldGenerateEvent = Math.random() < 0.3 && market.activeEvents.length < 2; // 30% โอกาส, สูงสุด 2 เหตุการณ์
    
    if (shouldGenerateEvent) {
      const event = generateRandomEvent();
      dispatch(addMarketEvent(event));
      
      // ลบเหตุการณ์เมื่อหมดอายุ
      setTimeout(() => {
        dispatch(removeMarketEvent(event.id));
      }, event.duration * 60 * 1000); // แปลงวันเป็นมิลลิวินาที
    }
  }, [currentDay, dispatch, market.activeEvents.length]);
  
  const getTrendIcon = (trend) => {
    if (!trend) return '➖';
    switch (trend.direction) {
      case 'up': return '📈 +';
      case 'down': return '📉 -';
      default: return '➖';
    }
  };
  
  const getTrendColor = (trend) => {
    if (!trend) return '#6b7280';
    switch (trend.direction) {
      case 'up': return '#16a34a';
      case 'down': return '#dc2626';
      default: return '#6b7280';
    }
  };
  
  const getSeasonInfo = () => {
    const seasons = {
      spring: { name: 'ฤดูใบไม้ผลิ', emoji: '🌸', color: '#ec4899' },
      summer: { name: 'ฤดูร้อน', emoji: '☀️', color: '#f59e0b' },
      autumn: { name: 'ฤดูใบไม้ร่วง', emoji: '🍂', color: '#ea580c' },
      winter: { name: 'ฤดูหนาว', emoji: '❄️', color: '#0ea5e9' }
    };
    return seasons[market.currentSeason] || seasons.spring;
  };
  
  const seasonInfo = getSeasonInfo();
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '2px solid #f59e0b'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{
          color: '#92400e',
          margin: 0,
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📊 ตลาด
        </h2>
        {/* <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: '#f59e0b',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {isExpanded ? 'ย่อ' : 'ขยาย'}
        </button> */}
      </div>
      
      {/* ข้อมูลฤดูกาลและเหตุการณ์ */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          background: seasonInfo.color,
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {seasonInfo.emoji} {seasonInfo.name}
        </div>
        
        {market.activeEvents.map(eventId => {
          const event = MARKET_EVENTS[eventId];
          if (!event) return null;
          
          return (
            <div key={eventId} style={{
              background: event.color,
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {event.emoji} {event.name}
            </div>
          );
        })}
      </div>
      
      {/* รายการราคา */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isExpanded ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px'
      }}>
        {Object.entries(CROPS_DATA).map(([cropId, crop]) => {
          const currentPrice = market.currentPrices[cropId] || crop.sellPrice;
          const trend = market.priceTrends[cropId];
          const basePrice = crop.sellPrice;
          const priceChange = currentPrice - basePrice;
          const priceChangePercent = basePrice > 0 ? ((priceChange / basePrice) * 100).toFixed(1) : '0.0';
          
          // Use price change from base price for display (not trend from previous price)
          const displayPercentage = Math.abs(parseFloat(priceChangePercent));
          const displayDirection = priceChange >= 0 ? 'up' : 'down';
          
          return (
            <div 
              key={cropId} 
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                border: '2px solid #e5e7eb',
                cursor: 'pointer',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.setProperty('transform', 'scale(1.02)', 'important');
                e.currentTarget.style.setProperty('box-shadow', 'none', 'important');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('transform', 'scale(1)', 'important');
                e.currentTarget.style.setProperty('box-shadow', 'none', 'important');
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '24px' }}>{crop.icon}</span>
                <div>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#1f2937'
                  }}>
                    {crop.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    ราคาพื้นฐาน: ฿{basePrice}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: priceChange >= 0 ? '#16a34a' : '#dc2626'
                }}>
                  ฿{currentPrice}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: priceChange >= 0 ? '#16a34a' : '#dc2626'
                }}>
                  {priceChange > 0 ? '📈' : priceChange < 0 ? '📉' : '➖'}
                  {priceChange !== 0 ? `${priceChange >= 0 ? '+' : ''}${priceChangePercent}%` : '0%'}
                </div>
              </div>
              
              {isExpanded && (
                <div style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  textAlign: 'center',
                  padding: '4px',
                  background: '#f9fafb',
                  borderRadius: '6px'
                }}>
                  {priceChange >= 0 ? '+' : ''}{priceChangePercent}% จากราคาพื้นฐาน
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {isExpanded && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(255,255,255,0.7)',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '12px'
          }}>
            💡 เคล็ดลับการขาย
          </h3>
          <div style={{
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '1.5'
          }}>
            • ราคาจะเปลี่ยนแปลงทุกวันตามฤดูกาลและเหตุการณ์<br/>
            • เก็บผลผลิตไว้ขายเมื่อราคาสูง<br/>
            • ติดตามเหตุการณ์พิเศษที่ส่งผลต่อราคา<br/>
            • ระดับ {level >= 5 ? '✅' : '🔒'} 5: ปลดล็อกการดูประวัติราคา
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketBoard;
