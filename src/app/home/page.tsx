import { BookmarkGrid } from "@/components/BookmarkGrid"
import { SearchBar } from "@/components/Searchbar"
import { ToolsBar } from "@/components/Toolbar"

export default function Home() {
  return (
    <main className="min-h-screen dark:bg-black transition-colors">
        <ToolsBar/>
      <BookmarkGrid />
      <SearchBar/>
    </main>
  )
}
