import dayjs from "dayjs";
import type { ProfilePage as PageSchema, WithContext } from "schema-dts";

import { USER } from "@/data/user";
import { readJsonFile } from "@/lib/admin-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Blog } from "@/features/profile/components/blog";
import { ProfileBio } from "@/features/profile/components/modern-profile-card";
import { HeroLayout } from "@/features/profile/components/hero-layout";
import { Projects } from "@/features/profile/components/projects";
import { ProfileCover } from "@/features/profile/components/profile-cover";
import { TeckStack } from "@/features/profile/components/teck-stack";
import { SocialLinks } from "@/features/profile/components/social-links";
import { AboutMe } from "@/features/profile/components/about-me";
import { Experiences } from "@/features/profile/components/experiences";
import { Awards } from "@/features/profile/components/awards";
import { Certifications } from "@/features/profile/components/certifications";

type SectionVisibility = {
  aboutMe: boolean;
  socialLinks: boolean;
  techStack: boolean;
  experiences: boolean;
  blog: boolean;
  projects: boolean;
  awards: boolean;
  certifications: boolean;
};

const defaultSectionVisibility: SectionVisibility = {
  aboutMe: true,
  socialLinks: true,
  techStack: true,
  experiences: true,
  blog: true,
  projects: true,
  awards: true,
  certifications: true,
};



export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  const profile = readJsonFile<any>("profile.json", {});
  const coverSettings = readJsonFile<any>("cover-settings.json", null);
  const sectionVisibility = {
    ...defaultSectionVisibility,
    ...(profile.sectionVisibility ?? {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd(profile)).replace(/</g, "\\u003c"),
        }}
      />

      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-14 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="sticky top-3 sm:top-4 lg:top-6 z-50 mb-2 sm:mb-3 lg:mb-5">
          <SiteHeader />
        </div>

        {/* Cover */}
        <div className="mb-2 sm:mb-3 lg:mb-5">
          <ProfileCover initialSettings={coverSettings} />
        </div>

        {/* Main content: HeroLayout handles card slide-in + full-width bio */}
        <HeroLayout>
          <div id="about" data-section="about">
            <ProfileBio />
          </div>
          {sectionVisibility.aboutMe ? <AboutMe /> : null}
          {sectionVisibility.socialLinks ? <SocialLinks /> : null}
          {sectionVisibility.techStack ? <TeckStack /> : null}
          {sectionVisibility.experiences ? <Experiences /> : null}
          {sectionVisibility.blog ? <Blog /> : null}
          {sectionVisibility.projects ? <Projects /> : null}
          {sectionVisibility.awards ? <Awards /> : null}
          {sectionVisibility.certifications ? <Certifications /> : null}
        </HeroLayout>

        {/* Footer */}
        <div className="mt-2 sm:mt-3 lg:mt-5" data-section="footer">
          <SiteFooter />
        </div>
      </div>
    </>
  );
}

function getPageJsonLd(profile: any): WithContext<PageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: dayjs(USER.dateCreated).toISOString(),
    dateModified: dayjs(USER.dateCreated).toISOString(),
    mainEntity: {
      "@type": "Person",
      name: profile?.displayName || USER.displayName,
      identifier: USER.username,
      image: profile?.avatar || USER.avatar,
    },
  };
}

