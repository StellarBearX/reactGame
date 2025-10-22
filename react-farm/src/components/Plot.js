import React, { useEffect, useState } from "react";
import { calculateGrowthProgress, getTimeRemaining, formatTime, isFullyGrown } from "../utils/time.js";
import useFarmStore from "../state/useFarmStore.js";

function Plot({ plot }) {
  const { getCropData, plantCrop, harvestCrop, selectedSeed } = useFarmStore();
  const crops = getCropData();
  const crop = plot.crop ? crops[plot.crop] : null;

  // state สำหรับ trigger re-render ทุกวิ
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!plot.crop) return; // ถ้าว่าง ไม่ต้องอัพเดท
    const interval = setInterval(() => {
      setTick(t => t + 1); // trigger re-render ทุกวิ
    }, 1000);
    return () => clearInterval(interval);
  }, [plot.crop]);

  if (!plot.crop) {
    return (
      <div className="plot empty" onClick={() => selectedSeed && plantCrop(plot.id)}>
        ว่าง
      </div>
    );
  }

  const progress = calculateGrowthProgress(plot.plantedAt, crop.growTime);
  const grown = isFullyGrown(plot.plantedAt, crop.growTime);
  const timeLeft = getTimeRemaining(plot.plantedAt, crop.growTime);

  return (
    <div
      className={`plot ${grown ? "grown" : "growing"}`}
      onClick={() => grown && harvestCrop(plot.id)}
    >
      <div>{crop.name}</div>
      {grown ? (
        <span>เก็บเกี่ยวได้!</span>
      ) : (
        <span>{progress.toFixed(0)}% ({formatTime(timeLeft)})</span>
      )}
    </div>
  );
}

export default Plot;
