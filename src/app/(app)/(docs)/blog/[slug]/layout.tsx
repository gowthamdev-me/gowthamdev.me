import { SiteHeader } from "@/components/site-header";

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-3 sm:px-6 md:px-8 max-w-[1600px] mx-auto py-4 sm:py-8 lg:py-12">
      {/* Sticky nav */}
      <div className="sticky top-3 sm:top-4 lg:top-6 z-50 mb-6 sm:mb-8">
        <SiteHeader />
      </div>

      {/* Article card */}
      <div className="relative mx-auto max-w-4xl rounded-2xl border border-zinc-100 dark:border-white/[0.06] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">

        {/* Subtle dot-grid texture — same as footer for consistency */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.045]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Faint red ambient glow in top-left corner */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(250,1,67,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
}