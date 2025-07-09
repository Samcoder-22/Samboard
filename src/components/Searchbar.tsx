"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      // Google search redirect in same page
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`
    }
  }

  return (
    <div className="w-full max-w-md px-4 pb-6 mx-auto">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search Google..."
        className="rounded-full px-6 py-5 text-base"
      />
    </div>
  )
}
