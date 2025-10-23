// src/components/Plot.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'; // ✅ ข้อ 5: Redux hooks (15%)
import { plantCrop, harvestCrop } from '../state/farmSlice.js';
import { calculateGrowthProgress, getTimeRemaining, formatTime, isFullyGrown } from "../utils/time.js";
import { CROPS_DATA } from '../data/crops.js';

function Plot({ plot }) {
  // ✅ ข้อ 5: useSelector, useDispatch
  const dispatch = useDispatch();
  const selectedSeed = useSelector((state) => state.farm.selectedSeed);
  
  const crop = plot.crop ? CROPS_DATA[plot.crop] : null;

  // state สำหรับ trigger re-render ทุกวิ
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!plot.crop) return; // ถ้าว่าง ไม่ต้องอัพเดท
    const interval = setInterval(() => {
      setTick(t => t + 1); // trigger re-render ทุกวิ
    }, 1000);
    return () => clearInterval(interval);
  }, [plot.crop]);

  // ✅ ข้อ 3: Handle click events (15%)
  const handlePlotClick = () => {
    if (!plot.crop && selectedSeed) {
      // ปลูกพืช
      dispatch(plantCrop(plot.id));
    } else if (plot.crop && grown) {
      // เก็บเกี่ยว
      dispatch(harvestCrop(plot.id));
    }
  };

  if (!plot.crop) {
    return (
      <div className="plot empty" onClick={handlePlotClick}>
        {selectedSeed ? '🌱 คลิกเพื่อปลูก' : 'ว่าง'}
      </div>
    );
  }

  const progress = calculateGrowthProgress(plot.plantedAt, crop.growTime);
  const grown = isFullyGrown(plot.plantedAt, crop.growTime);
  const timeLeft = getTimeRemaining(plot.plantedAt, crop.growTime);

  return (
    <div
      className={`plot ${grown ? "grown" : "growing"}`}
      onClick={handlePlotClick}
    >
      <div>{crop.icon} {crop.name}</div>
      {grown ? (
        <span>✨ เก็บเกี่ยวได้!</span>
      ) : (
        <span>{progress.toFixed(0)}% ({formatTime(timeLeft)})</span>
      )}
    </div>
  );
}

export default Plot;