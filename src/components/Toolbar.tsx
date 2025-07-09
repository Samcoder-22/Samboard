"use client"

import { DigitalClock } from "./DigitalClock"
import { ThemeToggle } from "./ThemeToggle"

export function ToolsBar() {
  return (
    <div className="w-full px-4 py-2 border-b dark:border-slate-700 flex justify-between items-center text-sm">
      <span className="font-semibold">🌐 Samcoders Homepage</span>
      <div className="flex items-center gap-4">
        <ThemeToggle/>
        <DigitalClock/>
        
        {/* Add widget components here like <Clock />, <SearchBar /> */}
      </div>
    </div>
  )
}
