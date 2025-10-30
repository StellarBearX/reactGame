// src/components/MarketBoard.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateMarketPrices, addMarketEvent, removeMarketEvent } from '../state/farmSlice.js';
import { calculateCurrentPrices, getCurrentSeason, generateRandomEvent, calculatePriceTrend, MARKET_EVENTS } from '../data/market.js';
import { CROPS_DATA } from '../data/crops.js';
import { getGameDay } from '../utils/time.js';

function MarketBoard() {
  const dispatch = useDispatch();
  const gameStartTime = useSelector((state) => state.farm.gameStartTime);
  const market = useSelector((state) => state.farm.market);
  const level = useSelector((state) => state.farm.level);
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentDay = getGameDay(gameStartTime);
  
  // อัพเดทราคาตลาดทุกวัน
  useEffect(() => {
    const shouldUpdatePrices = !market.lastPriceUpdate || 
      (Date.now() - market.lastPriceUpdate) > (60 * 1000); // อัพเดททุก 60 วินาที (1 วันในเกม)
    
    if (shouldUpdatePrices) {
      const marketData = calculateCurrentPrices(currentDay, market.activeEvents);
      const trends = calculatePriceTrend(marketData.prices, market.previousPrices);
      
      dispatch(updateMarketPrices({
        prices: marketData.prices,
        season: marketData.season,
        activeEvents: marketData.activeEvents,
        trends
      }));
    }
  }, [currentDay, dispatch, market.lastPriceUpdate, market.activeEvents, market.previousPrices]);
  
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
      case 'up': return '📈';
      case 'down': return '📉';
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
        <button
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
        </button>
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
          const priceChangePercent = ((priceChange / basePrice) * 100).toFixed(1);
          
          return (
            <div key={cropId} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px',
              border: '2px solid #e5e7eb',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}>
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
                  color: getTrendColor(trend)
                }}>
                  {getTrendIcon(trend)}
                  {trend && `${trend.percentage}%`}
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
