import { BookmarkGrid } from "@/components/BookmarkGrid"
import { ToolsBar } from "@/components/Toolbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors">
        <ToolsBar/>
      <BookmarkGrid />
    </main>
  )
}
