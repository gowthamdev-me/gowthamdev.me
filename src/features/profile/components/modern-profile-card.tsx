"use client";

import { useEffect, useState } from "react";
import * as motion from "motion/react-m";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { USER } from "@/data/user";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { decodeEmail } from "@/utils/string";
import { DownloadIcon } from "@/components/ui/download";
import { ArrowUpRightIcon } from "@/components/ui/arrow-up-right";
import { GithubIcon } from "@/components/ui/github";
import { LinkedinIcon } from "@/components/ui/linkedin";
import { TwitterIcon } from "@/components/ui/twitter";
import { InstagramIcon } from "@/components/ui/instagram";
import { FacebookIcon } from "@/components/ui/facebook";
import { YoutubeIcon } from "@/components/ui/youtube";
import { TypingAnimation } from "@/components/ui/typing-animation";

const SOCIAL_ICONS = {
    facebook: FacebookIcon,
    twitter: TwitterIcon,
    youtube: YoutubeIcon,
    linkedin: LinkedinIcon,
    github: GithubIcon,
    instagram: InstagramIcon,
};

const renderDisplayName = (name: string) => {
    if (!name) return null;
    return name.split("").map((char, index) => {
        if (char === "G" || char === "g") {
            return (
                <span key={index} className="text-[#FA0143]">
                    {char}
                </span>
            );
        }
        return char;
    });
};

// Profile Sidebar
export function ProfileSidebar() {
    const [profile, setProfile] = useState<any>(null);
    const [cvUrl, setCvUrl] = useState(USER.cvUrl || "");

    useEffect(() => {
        fetch(`/api/content?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                if (data?.profile) {
                    setProfile(data.profile);
                    if (data.profile.cvUrl) setCvUrl(data.profile.cvUrl);
                }
            })
            .catch(() => {});
    }, []);

    const avatar = profile?.avatar || USER.avatar;
    const displayName = profile?.displayName || USER.displayName;
    const address = profile?.address || USER.address;
    const jobTitle = profile?.jobTitle || USER.jobTitle;
    const bio = profile?.bio || USER.bio;

    const socialLinks = Object.entries(USER.footer.socialLinks).map(([key, href]) => ({
        name: key,
        href,
        Icon: SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS] || GithubIcon,
    }));

    const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const activeEmail = profile?.email
            ? decodeEmail(profile.email) || profile.email
            : USER.email
            ? decodeEmail(USER.email) || USER.email
            : "ggowtham92089@gmail.com";
        const subject = encodeURIComponent("Hi, I've seen your Portfolio");
        const mailtoUrl = `mailto:${activeEmail}?subject=${subject}`;
        if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(activeEmail).then(() => {
                toast.success("Email copied to clipboard!", {
                    description: `Copied "${activeEmail}" and opening your email app...`,
                });
                setTimeout(() => { window.location.href = mailtoUrl; }, 300);
            }).catch(() => { window.location.href = mailtoUrl; });
        } else {
            window.location.href = mailtoUrl;
        }
    };

    const formatLocation = (loc: string) => {
        if (!loc) return "Web Developer & Vibe Coder";
        if (loc.toLowerCase().startsWith("based")) {
            return loc.replace(/^based\s+in\s+/i, "");
        }
        return loc;
    };

    return (
        <>
            {/* DESKTOP (>= md / 768px) */}
            <div className="hidden md:flex flex-col relative overflow-hidden rounded-[28px] lg:rounded-[40px] border border-zinc-200/80 dark:border-white/10 bg-zinc-950 group text-left w-full shadow-2xl transition-all duration-300" style={{ height: "calc(100vh - 120px)", minHeight: "520px", maxHeight: "800px" }}>
                <Image src={avatar} alt={displayName} fill priority sizes="(max-width: 1024px) 50vw, 30vw" className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105" />
                {/* Bottom gradient fades photo into card dark section */}
                <div className="absolute bottom-0 left-0 right-0 h-[52%] bg-gradient-to-t from-zinc-950 via-zinc-950/85 via-30% to-transparent pointer-events-none" />
                <div className="absolute top-5 left-5 z-30">
                    <div className="flex items-center gap-2 bg-black/70 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-[#A3E635]/60 shadow-lg shadow-black/50">
                        <span className="relative flex size-2.5 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A3E635] opacity-75" />
                            <span className="relative inline-flex size-2.5 rounded-full bg-[#A3E635] shadow-[0_0_8px_#A3E635]" />
                        </span>
                        <span className="text-white text-xs font-bold tracking-wide whitespace-nowrap">Available for Work</span>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-30 p-6 lg:p-7">
                    <div className="mb-4">
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-black text-white leading-none tracking-tight" style={{ fontFamily: "'JapanDaisuki', serif" }}>{renderDisplayName(displayName)}</h2>
                        <p className="text-white/95 text-sm lg:text-base mt-2 font-bold tracking-wide drop-shadow">
                            <TypingAnimation />
                        </p>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-2.5 mb-4">
                        {socialLinks.slice(0, 4).map(({ name, href, Icon }) => (
                            <motion.a key={name} href={href} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.12 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="flex items-center justify-center size-8.5 lg:size-9.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white/80 hover:text-white transition-colors backdrop-blur-sm">
                                <Icon size={15} className="flex-shrink-0" />
                            </motion.a>
                        ))}
                        <div className="flex-1 h-px bg-white/20 ml-1" />
                    </div>
                    <div className="flex items-center gap-2.5">
                        <a href={cvUrl || "#"} download={cvUrl ? cvUrl.split("/").pop() : "CV.pdf"} onClick={(e) => { if (!cvUrl) { e.preventDefault(); toast.error("CV not available", { description: "Sorry CV can't upload I will upload Soon" }); } }} className="flex-1 h-11 lg:h-12 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs lg:text-sm border border-white/25 hover:border-white/45 backdrop-blur-sm transition-all duration-300 group/cv flex items-center justify-center gap-1.5">
                            <DownloadIcon size={15} className="flex-shrink-0" />
                            <span>Download CV</span>
                        </a>
                        <a href={`mailto:${USER.email ? decodeEmail(USER.email) || USER.email : "ggowtham92089@gmail.com"}?subject=${encodeURIComponent("Hi, I've seen your Portfolio")}`} onClick={handleEmailClick} className="flex-1 h-11 lg:h-12 rounded-xl bg-[#FA0143] hover:bg-[#ff1e5c] text-white font-extrabold text-xs lg:text-sm shadow-lg shadow-[#FA0143]/30 hover:shadow-[#FA0143]/55 transition-all duration-300 group/btn flex items-center justify-center gap-1.5">
                            <ArrowUpRightIcon size={15} className="flex-shrink-0" />
                            <span>{"Let's talk"}</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* MOBILE (< md / 768px) */}
            <div
              className="block md:hidden relative overflow-hidden rounded-[28px] xs:rounded-[32px] sm:rounded-[40px] border border-zinc-200/80 dark:border-white/10 bg-zinc-950 text-left w-full mx-auto max-w-md"
              style={{ aspectRatio: "3 / 4", minHeight: "420px", maxHeight: "560px" }}
            >
                {/* Full-bleed Portrait Image */}
                <Image
                    src={avatar}
                    alt={displayName}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top"
                />

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-[48%] bg-gradient-to-t from-black/95 via-black/65 to-transparent pointer-events-none" />

                {/* Top-Left Available for Work Badge */}
                <div className="absolute top-4 left-4 z-30">
                    <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/25 shadow-lg">
                        <span className="relative flex size-2 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A3E635] opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-[#A3E635]" />
                        </span>
                        <span className="text-white text-[11px] sm:text-xs font-bold tracking-wide whitespace-nowrap">Available for Work</span>
                    </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-5">
                    {/* Name + Typing */}
                    <div className="mb-2.5 sm:mb-3">
                        <h2
                            className="font-black text-white leading-none tracking-tight"
                            style={{
                                fontFamily: "'JapanDaisuki', serif",
                                fontSize: "clamp(1.6rem, 7vw, 2.4rem)",
                            }}
                        >
                            {renderDisplayName(displayName)}
                        </h2>
                        <p className="text-white/90 mt-1.5 font-bold drop-shadow-sm"
                           style={{ fontSize: "clamp(0.72rem, 3.2vw, 0.95rem)" }}>
                            <TypingAnimation />
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-2 mb-3 sm:mb-3.5">
                        {socialLinks.slice(0, 4).map(({ name, href, Icon }) => (
                            <motion.a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileTap={{ scale: 0.92 }}
                                style={{ width: "clamp(2rem, 9vw, 2.5rem)", height: "clamp(2rem, 9vw, 2.5rem)" }}
                                className="flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white/80 hover:text-white transition-colors backdrop-blur-sm flex-shrink-0"
                            >
                                <Icon size={14} className="flex-shrink-0" />
                            </motion.a>
                        ))}
                        <div className="flex-1 h-px bg-white/20 ml-1" />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        <a
                            href={cvUrl || "#"}
                            download={cvUrl ? cvUrl.split("/").pop() : "CV.pdf"}
                            onClick={(e) => {
                                if (!cvUrl) {
                                    e.preventDefault();
                                    toast.error("CV not available", { description: "Sorry CV can't upload I will upload Soon" });
                                }
                            }}
                            className="flex-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold border border-white/25 hover:border-white/45 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-1.5"
                            style={{ height: "clamp(2.4rem, 10vw, 3rem)", fontSize: "clamp(0.7rem, 3vw, 0.875rem)" }}
                        >
                            <DownloadIcon size={13} className="flex-shrink-0" />
                            <span>Download CV</span>
                        </a>
                        <a
                            href={`mailto:${USER.email ? decodeEmail(USER.email) || USER.email : "ggowtham92089@gmail.com"}?subject=${encodeURIComponent("Hi, I've seen your Portfolio")}`}
                            onClick={handleEmailClick}
                            className="flex-1 rounded-xl bg-[#FA0143] hover:bg-[#ff1e5c] text-white font-extrabold shadow-lg shadow-[#FA0143]/30 transition-all duration-300 flex items-center justify-center gap-1.5"
                            style={{ height: "clamp(2.4rem, 10vw, 3rem)", fontSize: "clamp(0.7rem, 3vw, 0.875rem)" }}
                        >
                            <ArrowUpRightIcon size={13} className="flex-shrink-0" />
                            <span>{"Let's talk"}</span>
                        </a>
                    </div>
                </div>
            </div>

        </>
    );
}

// Profile Bio — full-width with vertical auto-scrolling about text
export function ProfileBio() {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/content?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => { if (data?.profile) setProfile(data.profile); })
            .catch(() => {});
    }, []);

    const avatar = profile?.avatar || USER.avatar;
    const displayName = profile?.displayName || USER.displayName;
    const jobTitle = profile?.jobTitle || USER.jobTitle;
    const about = profile?.about || USER.about;

    // Split about text into non-empty paragraphs
    const aboutParagraphs: string[] = about
        ? about.trim().split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean)
        : [];

    // Horizontal marquee items doubled for seamless loop
    const tickerItems = [
        "✦ Web Developer", "✦ Next.js", "✦ React", "✦ TypeScript",
        "✦ Tailwind CSS", "✦ GSAP Animations", "✦ Figma",
        "✦ Open Source", "✦ Available for Work", "✦ Based in India",
    ];
    const tickerContent = [...tickerItems, ...tickerItems];

    return (
        <div className="bg-card text-card-foreground rounded-[20px] sm:rounded-[28px] lg:rounded-[40px] relative overflow-hidden flex flex-col justify-start border border-border">

            {/* Main content */}
            <div className="p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20 relative z-10 w-full flex flex-col">

                {/* Avatar header — visible on all screen sizes */}
                <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 lg:mb-8">
                    <div className="relative size-10 sm:size-12 rounded-full overflow-hidden border-2 border-zinc-100 dark:border-white/10 shadow-sm">
                        <Image src={avatar} alt={displayName} fill sizes="48px" className="object-cover" priority />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-zinc-900 dark:text-white font-bold text-base sm:text-lg leading-tight" style={{ fontFamily: "'JapanDaisuki', serif" }}>{renderDisplayName(displayName)}</span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-medium">{jobTitle || "Web Developer & Vibe Coder"}</span>
                    </div>
                </div>

                <h1
                    className="font-black text-zinc-900 dark:text-white mt-2 sm:mt-4 mb-3 sm:mb-6 lg:mb-8 tracking-tighter text-left leading-[1.15]"
                    style={{ fontSize: "clamp(1.25rem, 5vw, 3.5rem)" }}
                >
                    {"I'm building"}{" "}
                    <span className="inline-block px-2.5 py-0.5 sm:px-4 sm:py-1 bg-[#A3E635] rounded-full text-black text-[0.88em]">websites</span>
                    {" & turning "}
                    <span className="inline-block px-2.5 py-0.5 sm:px-4 sm:py-1 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-[0.85em]">ideas</span>{" "}
                    into reality.
                </h1>

                    {/* Full about text — all paragraphs visible, card expands to fit */}
                    <div className="flex flex-col gap-4 sm:gap-5 mb-6 sm:mb-8">
                        {aboutParagraphs.length > 0
                            ? aboutParagraphs.map((para, idx) => (
                                <p
                                    key={idx}
                                    className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed font-medium text-left"
                                >
                                    {para}
                                </p>
                            ))
                            : (
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed font-medium text-left">
                                    {about}
                                </p>
                            )
                        }
                    </div>

                    <div className="flex items-center justify-end pt-2 sm:pt-4">
                        {/* ── Clean minimal "View Projects" button with animated icon ── */}
                        <motion.a
                            href="#projects"
                            onClick={(e) => {
                                e.preventDefault();
                                const el = document.getElementById("projects");
                                if (el) {
                                    const headerOffset = 80;
                                    const elementPosition = el.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: "smooth"
                                    });
                                    window.history.pushState(null, "", "#projects");
                                } else {
                                    window.location.href = "/#projects";
                                }
                            }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="group/btn relative inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 select-none cursor-pointer rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#FA0143]/50 dark:hover:border-[#FA0143]/40 hover:bg-[#FA0143]/5 dark:hover:bg-[#FA0143]/10 transition-colors duration-300 overflow-hidden"
                        >
                            {/* Label */}
                            <span className="relative z-10 font-semibold text-sm sm:text-base text-zinc-800 dark:text-zinc-100 tracking-tight group-hover/btn:text-[#FA0143] dark:group-hover/btn:text-[#FA0143] transition-colors duration-300">
                                View Projects
                            </span>

                            {/* Animated arrow icon */}
                            <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-white/10 group-hover/btn:bg-[#FA0143] transition-colors duration-300 overflow-hidden">
                                {/* Icon slides out top-right and new one comes in from bottom-left */}
                                <motion.span
                                    className="absolute inset-0 flex items-center justify-center"
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    whileHover={{ x: 6, y: -6, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                >
                                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover/btn:text-white transition-colors duration-300" />
                                </motion.span>
                                <motion.span
                                    className="absolute inset-0 flex items-center justify-center"
                                    initial={{ x: -6, y: 6, opacity: 0 }}
                                    whileHover={{ x: 0, y: 0, opacity: 1 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                >
                                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                                </motion.span>
                            </span>
                        </motion.a>
                    </div>
            </div>

            {/* Horizontal auto-scrolling marquee strip */}
            <div className="relative w-full overflow-hidden border-t border-zinc-100 dark:border-white/5 bg-zinc-50/70 dark:bg-white/[0.03] py-3 sm:py-4">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-white dark:from-zinc-900 to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-white dark:from-zinc-900 to-transparent z-10" />
                <div className="flex gap-6 sm:gap-10 whitespace-nowrap w-max" style={{ animation: "profile-marquee 28s linear infinite" }}>
                    {tickerContent.map((item, idx) => (
                        <span key={idx} className="text-xs sm:text-sm font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 hover:text-[#FA0143] dark:hover:text-[#FA0143] transition-colors duration-300 cursor-default select-none">
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes profile-marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}

export function ModernProfileCard() {
    return (
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 w-full items-stretch relative">
            <div className="md:sticky md:top-8 md:self-start w-full md:w-auto md:min-w-[300px] lg:min-w-[350px] md:max-w-[380px]">
                <ProfileSidebar />
            </div>
            <ProfileBio />
        </div>
    );
}
