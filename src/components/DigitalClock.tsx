"use client"

import { useEffect, useState } from "react"

export function DigitalClock() {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(new Date()))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <span className="font-mono text-sm tabular-nums">{time}</span>
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}
