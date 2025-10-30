// src/components/CraftingStation.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { unlockStation, startCrafting, completeCrafting, sellProcessedItem } from '../state/farmSlice.js';
import { CRAFTING_STATIONS, RECIPES, PROCESSED_ITEMS, getAvailableRecipes, canCraftRecipe, calculateCraftingProfit } from '../data/recipes.js';
import { calculateCurrentPrices } from '../data/market.js';
import { getGameDay } from '../utils/time.js';

function CraftingStation() {
  const dispatch = useDispatch();
  const gameStartTime = useSelector((state) => state.farm.gameStartTime);
  const level = useSelector((state) => state.farm.level);
  const crafting = useSelector((state) => state.farm.crafting);
  const produceInventory = useSelector((state) => state.farm.produceInventory || {});
  const market = useSelector((state) => state.farm.market);
  
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const currentDay = getGameDay(gameStartTime);
  
  // ปลดล็อกสถานีตามระดับ
  useEffect(() => {
    if (level >= 3 && !crafting.stations.mill.unlocked) {
      dispatch(unlockStation('mill'));
    }
    if (level >= 5 && !crafting.stations.kitchen.unlocked) {
      dispatch(unlockStation('kitchen'));
    }
    if (level >= 8 && !crafting.stations.workshop.unlocked) {
      dispatch(unlockStation('workshop'));
    }
  }, [level, crafting.stations, dispatch]);
  
  // ตรวจสอบงานที่เสร็จสิ้น
  useEffect(() => {
    crafting.craftingQueue.forEach(job => {
      if (Date.now() - job.startTime >= job.craftingTime) {
        dispatch(completeCrafting(job.id));
      }
    });
  }, [crafting.craftingQueue, dispatch]);
  
  const handleStartCrafting = (recipeId, stationId) => {
    const recipe = RECIPES[recipeId];
    if (canCraftRecipe(recipeId, produceInventory)) {
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
  
  const marketPrices = calculateCurrentPrices(currentDay, market.activeEvents).prices;
  const availableRecipes = getAvailableRecipes(level, produceInventory, marketPrices);
  
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
      
      {/* Station Selection */}
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
                  (เลเวล {station.unlockLevel})
                </span>
              )}
            </button>
          );
        })}
      </div>
      
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
                      transition: 'width 0.3s ease',
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
            {availableRecipes
              .filter(recipe => recipe.station === selectedStation)
              .map(recipe => {
                const profit = calculateCraftingProfit(recipe.id, marketPrices);
                
                return (
                  <div key={recipe.id} style={{
                    background: '#f9fafb',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setSelectedRecipe(recipe)}
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
                        color: profit >= 0 ? '#16a34a' : '#dc2626',
                        fontWeight: 'bold'
                      }}>
                        กำไร: ฿{profit}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartCrafting(recipe.id, selectedStation);
                        }}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
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
                      ฿{price}
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
