import { Bookmark } from "@/stores/bookmarkStore";

export function triggerExportDownload(bookmarks: Bookmark[]) {
  const filename = `samboard-bookmarks-${new Date().toISOString().slice(0,10)}.json`;
  const blob = new Blob([JSON.stringify(bookmarks, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
