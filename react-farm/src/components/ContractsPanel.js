// src/components/ContractsPanel.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addContract, updateContractProgress, completeContract, expireContract } from '../state/farmSlice.js';
import { generateRandomContract, updateContractProgress as updateProgress, isContractExpired, getTimeRemaining } from '../data/contracts.js';
import { getGameDay } from '../utils/time.js';
import { CROPS_DATA } from '../data/crops.js';

function ContractsPanel() {
  const dispatch = useDispatch();
  const gameStartTime = useSelector((state) => state.farm.gameStartTime);
  const contracts = useSelector((state) => state.farm.contracts);
  const produceInventory = useSelector((state) => state.farm.produceInventory || {});
  const level = useSelector((state) => state.farm.level);
  
  const [selectedContract, setSelectedContract] = useState(null);
  
  const currentDay = getGameDay(gameStartTime);
  
  // สร้างสัญญาใหม่
  useEffect(() => {
    const shouldGenerateContract = contracts.activeContracts.length < 3 && 
      (Date.now() - contracts.lastContractGeneration) > (5 * 60 * 1000); // ทุก 5 นาที
    
    if (shouldGenerateContract) {
      const newContract = generateRandomContract(currentDay, level);
      dispatch(addContract(newContract));
    }
  }, [currentDay, level, contracts.activeContracts.length, contracts.lastContractGeneration, dispatch]);
  
  // อัพเดทความคืบหน้าสัญญา
  useEffect(() => {
    contracts.activeContracts.forEach(contract => {
      const updatedProgress = updateProgress(contract, produceInventory);
      if (JSON.stringify(updatedProgress.progress) !== JSON.stringify(contract.progress)) {
        dispatch(updateContractProgress({
          contractId: contract.id,
          progress: updatedProgress.progress
        }));
      }
    });
  }, [produceInventory, contracts.activeContracts, dispatch]);
  
  // ตรวจสอบสัญญาที่หมดอายุ
  useEffect(() => {
    const expiredContracts = contracts.activeContracts.filter(contract => 
      isContractExpired(contract, currentDay)
    );
    
    expiredContracts.forEach(contract => {
      dispatch(expireContract(contract.id));
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
                    gap: '8px'
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
