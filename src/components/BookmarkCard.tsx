"use client"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Bookmark } from "@/lib/bookmarks"

export function BookmarkCard({ title, url, icon }: Bookmark) {
  return (
    <Link href={url} target="_blank">
      <Card className="hover:bg-slate-100 dark:hover:bg-slate-800 oled:hover:bg-black transition-colors h-full">
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-2 h-full">
          <span className="text-3xl">{icon}</span>
          <span className="text-sm text-center font-medium">{title}</span>
        </CardContent>
      </Card>
    </Link>
  )
}
