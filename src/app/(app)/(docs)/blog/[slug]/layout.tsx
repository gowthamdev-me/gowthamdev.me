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
      <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-100 dark:border-white/[0.06] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        {/* Brand red top rule */}
        <div style={{ height: "3px", background: "linear-gradient(90deg,#FA0143,#ff6b8a)" }} />
        {children}
      </div>
    </div>
  );
}