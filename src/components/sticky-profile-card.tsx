"use client";

import { useEffect, useState } from "react";
import { ProfileSidebar } from "@/features/profile/components/modern-profile-card";

export function StickyProfileCard() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Get the About section (grid row 3 start) and Footer (grid row 9)
            const aboutSection = document.querySelector('[data-section="about"]');
            const footerSection = document.querySelector('[data-section="footer"]');

            if (!aboutSection || !footerSection) return;

            const aboutTop = aboutSection.getBoundingClientRect().top;
            const footerTop = footerSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            // Show when About section reaches top, hide when Footer is near
            const shouldShow = aboutTop <= 100 && footerTop > windowHeight * 0.5;
            setIsVisible(shouldShow);
        };

        handleScroll(); // Check initial state
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`lg:fixed lg:top-20 lg:left-8 lg:w-[340px] lg:z-30 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
        >
            <ProfileSidebar />
        </div>
    );
}

