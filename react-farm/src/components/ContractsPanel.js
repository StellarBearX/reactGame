// src/components/ContractsPanel.js
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addContract, updateContractProgress, completeContract, expireContract } from '../state/farmSlice.js';
import { generateRandomContract, updateContractProgress as updateProgress, isContractExpired, getTimeRemaining } from '../data/contracts.js';
import { getGameDay } from '../utils/time.js';
import { CROPS_DATA } from '../data/crops.js';
import { getContracts, createContract, updateContract, deleteContract } from '../services/api.js';

function ContractsPanel() {
  const dispatch = useDispatch();
  const gameStartTime = useSelector((state) => state.farm.gameStartTime);
  const contracts = useSelector((state) => state.farm.contracts);
  const produceInventory = useSelector((state) => state.farm.produceInventory || {});
  const level = useSelector((state) => state.farm.level);
  
  const [selectedContract, setSelectedContract] = useState(null);
  const [nextContractCountdown, setNextContractCountdown] = useState('05:00');
  const [apiLoading, setApiLoading] = useState(false);
  const [hasLoadedFromAPI, setHasLoadedFromAPI] = useState(false);
  
  // Track last progress to prevent duplicate API calls
  const lastProgressRef = useRef({});
  const updateTimeoutRef = useRef({});
  
  const currentDay = getGameDay(gameStartTime);
  
  // ✅ GET Method - Load contracts from API on mount (only once)
  useEffect(() => {
    // Only load if we haven't loaded yet
    if (hasLoadedFromAPI) return;
    
    const loadContractsFromAPI = async () => {
      try {
        setApiLoading(true);
        const response = await getContracts();
        
        if (response && response.data && Array.isArray(response.data)) {
          // Deduplicate contracts by ID from API response first
          const uniqueContracts = new Map();
          response.data.forEach(contract => {
            // Only keep active contracts that aren't completed/expired
            if (contract.status !== 'completed' && contract.status !== 'expired' && contract.status !== 'ready_to_complete') {
              // If ID doesn't exist in Map, add it (this automatically deduplicates)
              if (!uniqueContracts.has(contract.id)) {
                uniqueContracts.set(contract.id, contract);
              }
            }
          });
          
          // Get current Redux contracts to check against
          const currentIds = new Set(contracts.activeContracts.map(c => c.id));
          
          // Only add contracts that don't exist in Redux yet
          uniqueContracts.forEach((contract, id) => {
            if (!currentIds.has(id)) {
              dispatch(addContract(contract));
            }
          });
        }
        setHasLoadedFromAPI(true);
      } catch (error) {
        console.warn('Failed to load contracts from API, using local state:', error);
        setHasLoadedFromAPI(true); // Mark as attempted even if failed
      } finally {
        setApiLoading(false);
      }
    };
    
    loadContractsFromAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // นับถอยหลังสัญญาใหม่ - สร้างสัญญาเมื่อ countdown สำเร็จ
  useEffect(() => {
    const format = (ms) => {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
      const s = (totalSeconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };

    const update = () => {
      const windowMs = 5 * 60 * 1000;
      const elapsed = Date.now() - contracts.lastContractGeneration;
      const remaining = Math.max(0, windowMs - elapsed);
      setNextContractCountdown(format(remaining));

      // เมื่อถึงเวลาและยังไม่ครบ 3 สัญญา ให้สร้างสัญญาใหม่ทันที
      if (remaining === 0 && contracts.activeContracts.length < 3) {
        const newContract = generateRandomContract(currentDay, level);
        
        // ✅ POST Method - Create contract via API
        createContract(newContract)
          .then((response) => {
            // Sync to Redux after successful API call
            if (response && response.data) {
              dispatch(addContract(response.data));
            }
          })
          .catch((error) => {
            console.error('Failed to create contract via API, using Redux only:', error);
            // Fallback to Redux only if API fails
            dispatch(addContract(newContract));
          });
      }
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [contracts.lastContractGeneration, contracts.activeContracts.length, currentDay, level, dispatch]);
  
  // อัพเดทความคืบหน้าสัญญา (debounced เพื่อลด PUT requests)
  useEffect(() => {
    // Clear any pending updates
    Object.values(updateTimeoutRef.current).forEach(timeout => clearTimeout(timeout));
    updateTimeoutRef.current = {};
    
    contracts.activeContracts.forEach(contract => {
      const updatedProgress = updateProgress(contract, produceInventory);
      const progressKey = JSON.stringify(updatedProgress.progress);
      const lastProgressKey = lastProgressRef.current[contract.id];
      
      // Only update if progress actually changed
      if (progressKey !== lastProgressKey && progressKey !== JSON.stringify(contract.progress)) {
        // Debounce PUT requests (wait 500ms before sending)
        updateTimeoutRef.current[contract.id] = setTimeout(() => {
          // Double-check progress hasn't changed during debounce
          const currentProgress = updateProgress(contract, produceInventory);
          if (JSON.stringify(currentProgress.progress) === progressKey) {
            // ✅ PUT Method - Update contract progress via API
            updateContract(contract.id, {
              progress: currentProgress.progress,
              completionPercentage: currentProgress.completionPercentage,
              status: currentProgress.status
            })
              .then((response) => {
                // Sync to Redux after successful API call
                if (response && response.data) {
                  lastProgressRef.current[contract.id] = JSON.stringify(currentProgress.progress);
                  dispatch(updateContractProgress({
                    contractId: contract.id,
                    progress: currentProgress.progress
                  }));
                }
              })
              .catch((error) => {
                // Silently fallback - don't log expected 404 errors
                lastProgressRef.current[contract.id] = JSON.stringify(currentProgress.progress);
                dispatch(updateContractProgress({
                  contractId: contract.id,
                  progress: currentProgress.progress
                }));
              });
          }
        }, 500); // 500ms debounce
      }
    });
    
    // Cleanup on unmount
    return () => {
      Object.values(updateTimeoutRef.current).forEach(timeout => clearTimeout(timeout));
    };
  }, [produceInventory, contracts.activeContracts, dispatch]);
  
  // ตรวจสอบสัญญาที่หมดอายุ
  useEffect(() => {
    const expiredContracts = contracts.activeContracts.filter(contract => 
      isContractExpired(contract, currentDay)
    );
    
    expiredContracts.forEach(contract => {
      // ✅ DELETE Method - Remove expired contracts via API
      deleteContract(contract.id)
        .then((response) => {
          // Sync to Redux after successful API deletion
          if (response && response.data && response.data.success) {
            dispatch(expireContract(contract.id));
          }
        })
        .catch((error) => {
          // Silently fallback to Redux - 404s are expected (no real server)
          dispatch(expireContract(contract.id));
        });
    });
  }, [currentDay, contracts.activeContracts, dispatch]);
  
  const handleCompleteContract = (contractId) => {
    dispatch(completeContract(contractId));
    setSelectedContract(null);
  };
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#16a34a';
      case 'medium': return '#f59e0b';
      case 'hard': return '#dc2626';
      default: return '#6b7280';
    }
  };
  
  const getDifficultyEmoji = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '2px solid #0ea5e9'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{
          color: '#0c4a6e',
          margin: 0,
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📋 สัญญา
        </h2>
        <div style={{
          display: 'flex',
          gap: '8px',
          fontSize: '14px',
          color: '#0369a1'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.7)',
            padding: '6px 12px',
            borderRadius: '12px'
          }}>
            {contracts.activeContracts.length}/3 สัญญา
          </div>
          {contracts.completedContracts.length > 0 && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.2)',
              color: '#16a34a',
              padding: '6px 12px',
              borderRadius: '12px'
            }}>
              ✅ {contracts.completedContracts.length} เสร็จ
            </div>
          )}
        </div>
      </div>
      
      {contracts.activeContracts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
            ยังไม่มีสัญญา
          </div>
          <div style={{ fontSize: '14px' }}>
            สัญญาใหม่จะปรากฏทุก 5 นาที
          </div>
          <div style={{ fontSize: '14px', marginTop: '6px', color: '#0ea5e9', fontWeight: 'bold' }}>
            อีก {nextContractCountdown}
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {contracts.activeContracts.map(contract => {
            const timeRemaining = getTimeRemaining(contract, currentDay);
            const isReady = contract.status === 'ready_to_complete';
            const isExpired = timeRemaining === 0;
            
            return (
              <div key={contract.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                border: '2px solid #e5e7eb',
                transition: 'all 0.2s',
                cursor: 'pointer',
                opacity: isExpired ? 0.6 : 1
              }}
              onClick={() => setSelectedContract(contract)}>
                
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '24px' }}>{contract.emoji}</span>
                    <div>
                      <div style={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#1f2937'
                      }}>
                        {contract.title}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {contract.description}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      background: getDifficultyColor(contract.difficulty),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {getDifficultyEmoji(contract.difficulty)} {contract.difficulty}
                    </div>
                  </div>
                </div>
                
                {/* Requirements */}
                <div style={{
                  marginBottom: '12px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    📦 สิ่งที่ต้องการ:
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {Object.entries(contract.requirements).map(([itemId, required]) => {
                      const available = produceInventory[itemId] || 0;
                      const progress = contract.progress[itemId] || 0;
                      const isComplete = progress >= required;
                      
                      return (
                        <div key={itemId} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: isComplete ? '#dcfce7' : '#f3f4f6',
                          border: `2px solid ${isComplete ? '#22c55e' : '#e5e7eb'}`,
                          fontSize: '12px'
                        }}>
                          <span style={{ fontSize: '16px' }}>{CROPS_DATA[itemId]?.icon}</span>
                          <span style={{
                            fontWeight: 'bold',
                            color: isComplete ? '#16a34a' : '#374151'
                          }}>
                            {progress}/{required}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div style={{
                  marginBottom: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      ความคืบหน้า
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#374151'
                    }}>
                      {contract.completionPercentage?.toFixed(0) || 0}%
                    </span>
                  </div>
                  <div style={{
                    background: '#e5e7eb',
                    borderRadius: '8px',
                    height: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: isReady ? '#22c55e' : '#3b82f6',
                      height: '100%',
                      width: `${contract.completionPercentage || 0}%`,
                      transition: 'width 0.3s ease',
                      borderRadius: '8px'
                    }}></div>
                  </div>
                </div>
                
                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: isExpired ? '#dc2626' : '#6b7280'
                  }}>
                    ⏰ เหลือ {timeRemaining} วัน
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center'
                  }}>
                    {contract.rewards.map((reward, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        <span>{reward.type === 'money' ? '💰' : reward.type === 'xp' ? '⭐' : '🎁'}</span>
                        <span>{reward.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Complete Button */}
                {isReady && (
                  <div style={{
                    marginTop: '12px',
                    textAlign: 'center'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteContract(contract.id);
                      }}
                      style={{
                        background: '#22c55e',
                        color: 'white',
                        border: 'none',
                        padding: '8px 24px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#16a34a';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#22c55e';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      ✅ ส่งมอบสัญญา
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Completed Contracts */}
      {contracts.completedContracts.length > 0 && (
        <div style={{
          marginTop: '20px',
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          border: '2px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#16a34a',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ✅ สัญญาที่เสร็จสิ้น ({contracts.completedContracts.length})
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {contracts.completedContracts.slice(-5).map(contract => (
              <div key={contract.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>{contract.emoji}</span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#166534'
                  }}>
                    {contract.title}
                  </span>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#16a34a',
                  fontWeight: 'bold'
                }}>
                  +฿{contract.rewards.reduce((sum, r) => sum + (r.type === 'money' ? r.amount : 0), 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Contract Details Modal */}
      {selectedContract && (
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
        }}
        onClick={() => setSelectedContract(null)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0
              }}>
                {selectedContract.emoji} {selectedContract.title}
              </h3>
              <button
                onClick={() => setSelectedContract(null)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              {selectedContract.description}
            </div>
            
            {/* Detailed Requirements */}
            <div style={{
              marginBottom: '20px'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#374151',
                marginBottom: '12px'
              }}>
                📦 สิ่งที่ต้องการ:
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {Object.entries(selectedContract.requirements).map(([itemId, required]) => {
                  const available = produceInventory[itemId] || 0;
                  const progress = selectedContract.progress[itemId] || 0;
                  const isComplete = progress >= required;
                  
                  return (
                    <div key={itemId} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: '8px',
                      background: isComplete ? '#dcfce7' : '#f3f4f6',
                      border: `2px solid ${isComplete ? '#22c55e' : '#e5e7eb'}`
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '20px' }}>{CROPS_DATA[itemId]?.icon}</span>
                        <span style={{
                          fontWeight: 'bold',
                          color: '#374151'
                        }}>
                          {CROPS_DATA[itemId]?.name}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: isComplete ? '#16a34a' : '#374151'
                      }}>
                        {progress}/{required}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Rewards */}
            <div style={{
              marginBottom: '20px'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#374151',
                marginBottom: '12px'
              }}>
                🎁 รางวัล:
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {selectedContract.rewards.map((reward, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb'
                  }}>
                    <span style={{ fontSize: '18px' }}>
                      {reward.type === 'money' ? '💰' : reward.type === 'xp' ? '⭐' : '🎁'}
                    </span>
                    <span style={{
                      fontWeight: 'bold',
                      color: '#374151'
                    }}>
                      {reward.type === 'money' ? `฿${reward.amount}` : 
                       reward.type === 'xp' ? `${reward.amount} XP` :
                       `${reward.amount} ${reward.item}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{
              textAlign: 'center',
              marginTop: '20px'
            }}>
              <button
                onClick={() => setSelectedContract(null)}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractsPanel;
