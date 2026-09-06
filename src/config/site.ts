import { USER } from "@/data/user";
import type { NavItem } from "@/types/nav";

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.APP_URL || "https://gowthamdev.me",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const MAIN_NAV: NavItem[] = [];

export const SOURCE_CODE_GITHUB_REPO = "gowtham/gowthamdev.me";
export const SOURCE_CODE_GITHUB_URL = "https://github.com/gowtham/gowthamdev.me";

export const UTM_PARAMS = {
  utm_source: "gowthamdev.me",
  utm_medium: "portfolio_website",
  utm_campaign: "referral",
};

