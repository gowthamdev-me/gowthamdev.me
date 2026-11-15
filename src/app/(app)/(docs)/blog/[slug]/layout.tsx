import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Panel } from "@/features/profile/components/panel";

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-14 py-4 sm:py-6 lg:py-8 min-h-screen flex flex-col justify-between">
      <div>
        {/* Sticky nav matching homepage */}
        <div className="sticky top-3 sm:top-4 lg:top-6 z-50 mb-2 sm:mb-3 lg:mb-5">
          <SiteHeader />
        </div>

        {/* Panel container matching homepage panels */}
        <Panel className="mb-6 sm:mb-8">
          {children}
        </Panel>
      </div>

      {/* Footer matching homepage */}
      <div className="mt-2 sm:mt-3 lg:mt-5" data-section="footer">
        <SiteFooter />
      </div>
    </div>
  );
}
