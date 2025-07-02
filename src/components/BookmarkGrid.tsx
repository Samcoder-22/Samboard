"use client"
import { bookmarks } from "@/lib/bookmarks"
import { BookmarkCard } from "./BookmarkCard"

export function BookmarkGrid() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 px-4 py-8 max-w-6xl mx-auto">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.url} {...bookmark} />
      ))}
    </div>
  )
}
