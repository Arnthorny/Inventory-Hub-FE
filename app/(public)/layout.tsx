import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Link href="/auth/login">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  DS
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Inventory Hub
              </h1>
            </div>
          </Link>
        </div>
      </nav>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
