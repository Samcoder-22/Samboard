// components/ThemeToggle.tsx
"use client"

import { useEffect, useState } from "react"
import { Sun, Moon, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"

const themes = ["light", "dark", "oled"] as const

type Theme = typeof themes[number]

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null
    if (saved && themes.includes(saved)) {
      setTheme(saved)
      document.documentElement.className = saved
    }
  }, [])

  const cycleTheme = () => {
    const next = themes[(themes.indexOf(theme) + 1) % themes.length]
    setTheme(next)
    localStorage.setItem("theme", next)
    document.documentElement.className = next
  }

  return (
    <Button onClick={cycleTheme} variant="outline" size="icon" className="rounded-full">
      {theme === "light" && <Sun className="h-5 w-5" />}
      {theme === "dark" && <Moon className="h-5 w-5" />}
      {theme === "oled" && <Circle className="h-5 w-5" />}
    </Button>
  )
}