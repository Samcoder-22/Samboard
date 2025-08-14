import MainLayout from "@/components/layout/MainLayout";
import ClockWidget from "@/components/widgets/ClockWidget";
import BookmarkGrid from "@/components/grid/BookmarkGrid";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <ClockWidget />
        <BookmarkGrid />
      </div>
    </MainLayout>
  );
}
