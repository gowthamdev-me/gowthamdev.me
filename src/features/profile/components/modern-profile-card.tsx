"use client";

import { useEffect, useState } from "react";
import * as motion from "motion/react-m";
import { ArrowUpRight, Download, Facebook, Twitter, Youtube, Linkedin, Github, Instagram } from "lucide-react";
import Image from "next/image";
import { USER } from "@/data/user";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { decodeEmail } from "@/utils/string";

const SOCIAL_ICONS = {
    facebook: Facebook,
    twitter: Twitter,
    youtube: Youtube,
    linkedin: Linkedin,
    github: Github,
    instagram: Instagram,
};

// ─── Profile Sidebar ──────────────────────────────────────────────────────────
// Animation is handled by the parent HeroLayout — this component just renders.
export function ProfileSidebar() {
    const [cvUrl, setCvUrl] = useState(USER.cvUrl || "");

    useEffect(() => {
        fetch(`/api/content?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                if (data?.profile?.cvUrl) setCvUrl(data.profile.cvUrl);
            })
            .catch(() => { });
    }, []);

    const socialLinks = Object.entries(USER.footer.socialLinks).map(([key, href]) => ({
        name: key,
        href,
        Icon: SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS] || Github,
    }));

    return (
        <div className="aspect-[3/4] sm:aspect-[3/4] md:aspect-[3/4] lg:aspect-auto lg:h-full relative overflow-hidden rounded-[20px] sm:rounded-[28px] md:rounded-[36px] lg:rounded-[40px] border border-white/10 bg-zinc-950 group shadow-2xl text-left w-full">
            <Image
                src={USER.avatar}
                alt={USER.displayName}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

            {/* Available for Work Badge */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-30">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-xl px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-[#A3E635]/40 shadow-lg shadow-black/50 transition-all duration-300 hover:border-[#A3E635]/70 hover:bg-black/60">
                    <span className="relative flex size-2 sm:size-2.5 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A3E635] opacity-75" />
                        <span className="relative inline-flex size-2 sm:size-2.5 rounded-full bg-[#A3E635] shadow-[0_0_8px_#A3E635]" />
                    </span>
                    <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wide whitespace-nowrap">Available for Work</span>
                </div>
            </div>

            {/* Social Links */}
            <div className="absolute top-14 right-4 sm:top-16 sm:right-5 md:top-7 md:right-7 lg:top-8 lg:right-8 flex flex-col gap-1.5 sm:gap-2 md:gap-3 z-30">
                {socialLinks.slice(0, 4).map(({ name, href, Icon }) => (
                    <motion.a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="size-8 sm:size-9 md:size-11 lg:size-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-300 shadow-lg"
                    >
                        <Icon className="size-3.5 sm:size-4 md:size-5 lg:size-5" />
                    </motion.a>
                ))}
            </div>

            {/* Bottom Content */}
            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 z-30 p-3 sm:p-5 md:p-8 lg:p-6">
                {/* Frosted backdrop for bottom section */}
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 border border-white/10 shadow-xl">
                    <h2 className="text-sm sm:text-lg md:text-2xl lg:text-xl font-bold text-white mb-0.5 sm:mb-1 tracking-tight leading-snug">
                        Hey, I&apos;m {USER.displayName}
                    </h2>
                    <p className="text-white/55 text-[10px] sm:text-[11px] md:text-sm lg:text-sm mb-2.5 sm:mb-3 md:mb-4 font-medium leading-relaxed">
                        Smart design &amp; no-code dev. Based in {USER.address}.
                    </p>

                    <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 w-full">
                        {/* Download CV — ghost/glass button */}
                        <Button
                            asChild
                            className="flex-1 h-9 sm:h-10 md:h-12 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm md:text-base border border-white/25 hover:border-white/50 backdrop-blur-sm shadow-md transition-all duration-300 ease-out group/cv"
                            onClick={(e) => {
                                if (!cvUrl) {
                                    e.preventDefault();
                                    toast.error("CV not available", {
                                        description: "Sorry CV can't upload I will upload Soon",
                                    });
                                }
                            }}
                        >
                            <a
                                href={cvUrl || "#"}
                                download={cvUrl ? cvUrl.split("/").pop() : "CV.pdf"}
                                className="flex items-center justify-center gap-1.5 w-full"
                            >
                                <Download className="size-3.5 sm:size-4 md:size-5 transition-transform duration-300 group-hover/cv:translate-y-0.5 flex-shrink-0" />
                                <span>Download CV</span>
                            </a>
                        </Button>

                        {/* Let's talk — lime accent button */}
                        <Button
                            className="flex-1 h-9 sm:h-10 md:h-12 rounded-xl sm:rounded-2xl bg-[#A3E635] hover:bg-[#bef264] text-black font-bold text-xs sm:text-sm md:text-base shadow-lg shadow-[#A3E635]/30 hover:shadow-[#A3E635]/50 transition-all duration-300 ease-out group/btn border-0"
                            onClick={() => {
                                let parsedEmail = USER.email ? decodeEmail(USER.email) : "";
                                if (!parsedEmail) parsedEmail = USER.email;
                                const email = parsedEmail || "ggowtham92089@gmail.com";
                                const subject = encodeURIComponent("Hi i have seen your Portfolio");
                                const composerUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}&su=${subject}`;
                                const win = window.open(composerUrl, "_blank");
                                if (win) {
                                    toast.success("Thank you for the Mail! 📧", {
                                        description: "Gmail has opened - ready for you to send your message",
                                    });
                                }
                            }}
                        >
                            <ArrowUpRight className="mr-1 size-3.5 sm:size-4 md:size-5 transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 flex-shrink-0" />
                            <span>Let&apos;s talk</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Profile Bio ──────────────────────────────────────────────────────────────
// Visible immediately on page load (full width). No entrance animation here —
// the layout shift caused by HeroLayout is the visual cue.
export function ProfileBio() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[20px] sm:rounded-[28px] lg:rounded-[40px] p-5 sm:p-8 md:p-12 lg:p-16 xl:p-20 relative overflow-hidden flex flex-col justify-start shadow-xl border border-zinc-100 dark:border-white/5">
            <div className="relative z-10 w-full flex flex-col">
                {/* Header with Avatar */}
                <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 lg:mb-8">
                    <div className="relative size-10 sm:size-12 rounded-full overflow-hidden border-2 border-zinc-100 dark:border-white/10 shadow-sm">
                        <Image src={USER.avatar} alt={USER.displayName} fill sizes="48px" className="object-cover" priority />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-zinc-900 dark:text-white font-bold text-base sm:text-lg leading-tight">{USER.displayName}</span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-medium">UI Designer &amp; No-Code Developer</span>
                    </div>
                </div>

                <div className="max-w-5xl">
                    <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white mb-3 sm:mb-4 lg:mb-5 tracking-tighter leading-[1.15] sm:leading-[0.95]">
                        I&apos;m building{" "}
                        <span className="inline-block px-2 py-0.5 sm:px-4 sm:py-1 bg-[#A3E635] rounded-full text-black text-[0.85em]">websites</span>
                        <br className="hidden sm:block" />{" "}
                        &amp; turning{" "}
                        <span className="inline-block px-2 py-0.5 sm:px-4 sm:py-1 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-[0.85em]">ideas</span>{" "}
                        into reality.
                    </h1>

                    <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-lg md:text-xl leading-relaxed mb-4 sm:mb-5 lg:mb-6 font-medium max-w-2xl">
                        I am a visionary creative designer, known for my ability to turn concepts into captivating visual narratives. My passion for design allows me to craft compelling stories.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-3 sm:gap-4 text-zinc-900 dark:text-white font-bold bg-zinc-50 dark:bg-white/5 px-4 py-2.5 sm:px-6 sm:py-4 rounded-[16px] sm:rounded-[24px] border border-zinc-100 dark:border-white/10">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="size-6 sm:size-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800" />
                                ))}
                            </div>
                            <span className="text-sm sm:text-base">Trusted by 10+ clients</span>
                        </div>

                        <Button
                            onClick={() => {
                                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            variant="outline"
                            className="h-10 sm:h-12 px-6 sm:px-8 rounded-[16px] sm:rounded-[24px] border-2 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white font-bold text-sm sm:text-base hover:bg-zinc-50 dark:hover:bg-white/5 transition-[background-color,border-color] duration-300 ease-out gap-2 group/cv"
                        >
                            View Projects <ArrowUpRight className="size-4 sm:size-6 transition-transform duration-300 ease-out group-hover/cv:translate-x-1 group-hover/cv:-translate-y-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ModernProfileCard() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch relative">
            <div className="lg:sticky lg:top-8 lg:self-start w-full lg:w-auto lg:min-w-[420px] lg:max-w-[420px]">
                <ProfileSidebar />
            </div>
            <ProfileBio />
        </div>
    );
}
