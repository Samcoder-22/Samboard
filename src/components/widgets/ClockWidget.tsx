"use client";
import { useEffect, useState } from "react";

export default function ClockWidget() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-base-200 rounded-lg shadow">
      <h2 className="text-xl font-bold">{time}</h2>
    </div>
  );
}
