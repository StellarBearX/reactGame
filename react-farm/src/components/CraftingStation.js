/**
 * ============================================
 * 📁 CraftingStation.js - Component โรงงานแปรรูป
 * ============================================
 * 
 * ไฟล์นี้แสดงโรงงานแปรรูปสำหรับแปรรูปสินค้าเป็นผลิตภัณฑ์มูลค่าสูงกว่า
 * 
 * หน้าที่หลัก:
 * 1. แสดงสถานีแปรรูปทั้งหมด (โรงสี, ครัว, โรงงาน)
 * 2. แสดงสูตรแปรรูปที่ใช้ได้ (Recipes)
 * 3. จัดการการเริ่มแปรรูป (startCrafting)
 * 4. แสดงคิวงานแปรรูป (craftingQueue)
 * 5. จัดการการขายสินค้าที่แปรรูปแล้ว (sellProcessedItem)
 * 6. Auto-complete งานที่เสร็จแล้ว
 * 7. อัพเดท Progress แบบ real-time
 * 
 * การเชื่อมโยง:
 * - TabbedSidebar.js: ใช้ใน Tab 'crafting'
 * - farmSlice.js: เรียกใช้ startCrafting, completeCrafting, sellProcessedItem actions
 * - recipes.js: ดึงข้อมูลสถานี สูตร และสินค้าแปรรูป
 * - market.js: คำนวณราคาสำหรับคำนวณกำไร
 * - time.js: คำนวณวันในเกม
 * - ShopPage.js: ปลดล็อกสถานี (ซื้อจากร้านอัปเกรด)
 * - React Router: navigate ไปร้านอัปเกรดถ้ายังไม่ปลดล็อกสถานี
 * - Redux Store: ดึงข้อมูล crafting, produceInventory, market, level
 * 
 * สถานีแปรรูป:
 * 1. โรงสี (Mill): ปลดล็อกที่เลเวล 3, ราคา 150
 * 2. ครัว (Kitchen): ปลดล็อกที่เลเวล 5, ราคา 250
 * 3. โรงงาน (Workshop): ปลดล็อกที่เลเวล 8, ราคา 400
 * 
 * Flow การทำงาน:
 * 1. ตรวจสอบว่ามีสถานีปลดล็อกหรือไม่
 * 2. ถ้าไม่มี → แสดงข้อความแนะนำไปร้านอัปเกรด
 * 3. ถ้ามี → แสดงสถานี สูตร และคิวงาน
 * 4. Auto-complete งานที่เสร็จแล้ว (ตรวจสอบทุก 100ms)
 */

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // 🔗 Redux Hooks
import { useNavigate } from 'react-router-dom'; // 🔗 React Router: Navigation
import { startCrafting, completeCrafting, sellProcessedItem } from '../state/farmSlice.js'; // 🔗 Redux Actions
import { CRAFTING_STATIONS, RECIPES, PROCESSED_ITEMS, getAvailableRecipes, canCraftRecipe, calculateCraftingProfit } from '../data/recipes.js'; // 🔗 Crafting Data & Functions
import { calculateCurrentPrices } from '../data/market.js'; // 🔗 Market: คำนวณราคา
import { getGameDay } from '../utils/time.js'; // 🔗 Utility: คำนวณวันในเกม

/**
 * CraftingStation: Component โรงงานแปรรูป
 * 
 * แสดงสถานี สูตร และคิวงานแปรรูป
 */
function CraftingStation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gameStartTime = useSelector((state) => state.farm.gameStartTime);
  const level = useSelector((state) => state.farm.level);
  const crafting = useSelector((state) => state.farm.crafting);
  const produceInventory = useSelector((state) => state.farm.produceInventory || {});
  const market = useSelector((state) => state.farm.market);
  
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  // tick state to force re-render for realtime progress/time remaining
  const [tick, setTick] = useState(0);
  
  const currentDay = getGameDay(gameStartTime);
  
  // Default to โรงสี (mill) first when entering the tab, or the first unlocked station
  useEffect(() => {
    if (selectedStation) return;
    const order = ['mill', 'kitchen', 'workshop'];
    for (const id of order) {
      if (crafting.stations[id]?.unlocked) {
        setSelectedStation(id);
        return;
      }
    }
  }, [selectedStation, crafting.stations]);

  // Note: Stations are now only unlocked via ShopPage (requires money + level)
  // Removed automatic unlock - players must purchase from shop
  
  // Realtime updater and auto-completion checker for crafting jobs
  useEffect(() => {
    if (crafting.craftingQueue.length === 0) return; // no jobs -> no timer
    const interval = setInterval(() => {
      // trigger UI refresh for progress/time remaining
      setTick(prev => (prev + 1) % 1_000_000);
      // also complete any jobs that have reached their crafting time
      crafting.craftingQueue.forEach(job => {
        if (Date.now() - job.startTime >= job.craftingTime) {
          dispatch(completeCrafting(job.id));
        }
      });
    }, 100);
    return () => clearInterval(interval);
  }, [crafting.craftingQueue, dispatch]);
  
  // Combine raw produce and processed items for recipe checking
  const combinedInventory = {
    ...produceInventory,
    ...crafting.processedInventory
  };
  
  const marketPrices = calculateCurrentPrices(currentDay, market.activeEvents).prices;
  const availableRecipes = getAvailableRecipes(level, combinedInventory, marketPrices);

  const handleStartCrafting = (recipeId, stationId) => {
    const recipe = RECIPES[recipeId];
    if (canCraftRecipe(recipeId, combinedInventory)) {
      dispatch(startCrafting({
        recipeId,
        stationId,
        recipe
      }));
    }
  };
  
  const handleSellProcessedItem = (itemId, amount) => {
    const item = PROCESSED_ITEMS[itemId];
    const price = market.currentPrices[itemId] || item.basePrice;
    dispatch(sellProcessedItem({
      itemId,
      amount,
      price
    }));
  };
  
  const getCraftingProgress = (job) => {
    const elapsed = Date.now() - job.startTime;
    const progress = Math.min((elapsed / job.craftingTime) * 100, 100);
    return progress;
  };
  
  const getTimeRemaining = (job) => {
    const elapsed = Date.now() - job.startTime;
    const remaining = Math.max(0, job.craftingTime - elapsed);
    return Math.ceil(remaining / 1000); // แปลงเป็นวินาที
  };
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '2px solid #f59e0b'
    }}>
      <h2 style={{
        color: '#92400e',
        margin: '0 0 20px 0',
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🏭 โรงงานแปรรูป
      </h2>
      
      {/* Check if any station is unlocked */}
      {(() => {
        const unlockedStations = Object.entries(CRAFTING_STATIONS).filter(
          ([stationId]) => crafting.stations[stationId]?.unlocked
        );
        const hasUnlockedStations = unlockedStations.length > 0;

        // If no stations are unlocked, show helpful message
        if (!hasUnlockedStations) {
          return (
            <div style={{
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '64px',
                marginBottom: '16px'
              }}>
                🔒
              </div>
              <h3 style={{
                color: '#374151',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '12px'
              }}>
                ยังไม่มีสถานีที่ปลดล็อค
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>
                ไปที่ร้านอัปเกรดเพื่อปลดล็อคสถานีแปรรูป<br/>
                คุณสามารถซื้อโรงสี ครัว และโรงงานได้
              </p>
              <button
                onClick={() => navigate('/shop')}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                🛒 ไปที่ร้านอัปเกรด
              </button>
            </div>
          );
        }

        // Show station selection buttons if any are unlocked
        return (
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            {Object.entries(CRAFTING_STATIONS).map(([stationId, station]) => {
              const isUnlocked = crafting.stations[stationId]?.unlocked || false;
              const canUnlock = level >= station.unlockLevel;
              
              return (
                <button
                  key={stationId}
                  onClick={() => setSelectedStation(isUnlocked ? stationId : null)}
                  disabled={!isUnlocked && !canUnlock}
                  title={!isUnlocked ? 'ไปที่ร้านอัปเกรดเพื่อปลดล็อค' : ''}
                  style={{
                    background: isUnlocked ? station.color : '#e5e7eb',
                    color: isUnlocked ? 'white' : '#9ca3af',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    opacity: isUnlocked ? 1 : 0.6
                  }}
                  onMouseEnter={(e) => {
                    if (isUnlocked) {
                      e.target.style.transform = 'scale(1.05)';
                    } else {
                      e.target.style.cursor = 'not-allowed';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isUnlocked) {
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <span>{station.emoji}</span>
                  <span>{station.name}</span>
                  {!isUnlocked && (
                    <span style={{ fontSize: '12px' }}>
                      (ยังไม่ปลดล็อค)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        );
      })()}
      
      {/* Crafting Queue */}
      {crafting.craftingQueue.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          border: '2px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '12px'
          }}>
            🔄 กำลังผลิต
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {crafting.craftingQueue.map(job => {
              const progress = getCraftingProgress(job);
              const timeRemaining = getTimeRemaining(job);
              
              return (
                <div key={job.id} style={{
                  background: '#f9fafb',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '2px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#374151'
                    }}>
                      {job.recipe.emoji} {job.recipe.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      เหลือ {timeRemaining}s
                    </div>
                  </div>
                  
                  <div style={{
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    height: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: '#3b82f6',
                      height: '100%',
                      width: `${progress}%`,
                      transition: 'width 0.1s linear',
                      willChange: 'width',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Recipe Selection */}
      {selectedStation && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          border: '2px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '12px'
          }}>
            📋 สูตรที่สามารถทำได้
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '12px'
          }}>
            {Object.values(RECIPES)
              .filter(r => r.station === selectedStation)
              .map(r => ({
                ...r,
                canCraft: canCraftRecipe(r.id, combinedInventory),
                profit: calculateCraftingProfit(r.id, marketPrices)
              }))
              .sort((a, b) => {
                if (a.canCraft !== b.canCraft) return a.canCraft ? -1 : 1;
                return (b.profit || 0) - (a.profit || 0);
              })
              .map(recipe => {
                const disabled = !recipe.canCraft;
                
                return (
                  <div key={recipe.id} style={{
                    background: '#f9fafb',
                    borderRadius: '8px',
                    padding: '12px',
                    border: `2px solid ${disabled ? '#e5e7eb' : '#cbd5e1'}`,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: disabled ? 0.55 : 1
                  }}
                  onClick={() => !disabled && setSelectedRecipe(recipe)}
                  onMouseEnter={(e) => {
                    if (disabled) return;
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '20px' }}>{recipe.emoji}</span>
                      <div>
                        <div style={{
                          fontWeight: 'bold',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          {recipe.name}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          เวลา: {Math.ceil(recipe.craftingTime / 1000)}s
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '8px'
                    }}>
                      วัตถุดิบ: {Object.entries(recipe.inputs).map(([id, amount]) => 
                        `${amount}x ${id}`
                      ).join(', ')}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        color: recipe.profit > 0 ? '#16a34a' : '#dc2626',
                        fontWeight: 'bold'
                      }}>
                        กำไร: ฿{recipe.profit}
                      </div>
                      <button
                        disabled={disabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (disabled) return;
                          handleStartCrafting(recipe.id, selectedStation);
                        }}
                        style={{
                          background: disabled ? '#cbd5e1' : '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: disabled ? 'not-allowed' : 'pointer'
                        }}
                      >
                        เริ่มผลิต
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      
      {/* Processed Items Inventory */}
      {Object.keys(crafting.processedInventory).length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          border: '2px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '12px'
          }}>
            📦 สินค้าแปรรูป
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {Object.entries(crafting.processedInventory).map(([itemId, amount]) => {
              const item = PROCESSED_ITEMS[itemId];
              const price = market.currentPrices[itemId] || item.basePrice;
              
              return (
                <div key={itemId} style={{
                  background: '#f9fafb',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '2px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>{item.emoji}</span>
                    <div>
                      <div style={{
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        {item.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {amount} ชิ้น
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#16a34a',
                      fontWeight: 'bold'
                    }}>
                      ฿{price * amount}
                    </div>
                    <button
                      onClick={() => handleSellProcessedItem(itemId, 1)}
                      style={{
                        background: '#22c55e',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      ขาย
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CraftingStation;
