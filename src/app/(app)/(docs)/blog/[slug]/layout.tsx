import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-14 py-4 sm:py-6 lg:py-8 min-h-screen flex flex-col justify-between">
      <div>
        {/* Sticky nav matching homepage */}
        <div className="sticky top-3 sm:top-4 lg:top-6 z-50 mb-4 sm:mb-6 lg:mb-8">
          <SiteHeader />
        </div>

        {/* Article card matching homepage full-width container style */}
        <div className="relative w-full rounded-[24px] sm:rounded-[32px] border border-border bg-card shadow-sm overflow-hidden mb-6 sm:mb-8">
          {/* Subtle background ambient texture & glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(250,1,67,0.08) 0%, transparent 70%)",
            }}
          />

          <div className="relative">
            {children}
          </div>
        </div>
      </div>

      {/* Footer matching homepage */}
      <div className="mt-2 sm:mt-3 lg:mt-5">
        <SiteFooter />
      </div>
    </div>
  );
}