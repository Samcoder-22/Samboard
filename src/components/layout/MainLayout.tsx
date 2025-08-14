export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
}
