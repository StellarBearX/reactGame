// App.js
import React, { useEffect, useState } from 'react';
import { 
  Sprout, 
  ShoppingCart, 
  Package, 
  Sun, 
  Moon, 
  Save, 
  Upload,
  RotateCcw 
} from 'lucide-react';
import useFarmStore from './state/useFarmStore.js';
import { 
  calculateGrowthProgress, 
  getDayNightCycle,
  formatTime 
} from './utils/time.js';

function App() {
  const {
    money,
    plots,
    inventory,
    gameStartTime,
    selectedSeed,
    getCropData,
    getCrop,
    addMoney,
    spendMoney,
    selectSeed,
    clearSelectedSeed,
    buySeeds,
    plantCrop,
  } = useFarmStore();
  
  const [dayNight, setDayNight] = useState(getDayNightCycle(gameStartTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setDayNight(getDayNightCycle(gameStartTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStartTime]);

  const cropsData = getCropData();

  return (''); // UI implementation goes here
}

export default App;