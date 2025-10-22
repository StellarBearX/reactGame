import React, { useState, useEffect } from "react";
import { getDayNightCycle, getGameDay } from "../utils/time.js";
import useFarmStore from "../state/useFarmStore.js";

function StatusBar() {
  const { money, gameStartTime } = useFarmStore();
  const [dayNight, setDayNight] = useState(getDayNightCycle(gameStartTime));
  const [gameDay, setGameDay] = useState(getGameDay(gameStartTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setDayNight(getDayNightCycle(gameStartTime));
      setGameDay(getGameDay(gameStartTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStartTime]);

  return (
    <div className="status-bar">
      <p>💰 เงิน: {money}</p>
      <p>📅 วันที่ {gameDay}</p>
      <p>{dayNight === "day" ? "☀️ กลางวัน" : "🌙 กลางคืน"}</p>
    </div>
  );
}

export default StatusBar;
