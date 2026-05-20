"use client";

import { Mail } from "lucide-react";
import { toast } from "sonner";

interface ContactButtonProps {
  email?: string;
  variant?: "icon" | "default";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ContactButton({
  email = "ggowtham92089@gmail.com",
  variant = "icon",
  size = "md",
  showLabel = false,
}: ContactButtonProps) {
  const handleEmailClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Gmail compose URL with pre-filled fields
      const subject = encodeURIComponent("Hi i have seen your Portfolio");
      const composerUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}&su=${subject}`;
      
      const win = window.open(composerUrl, "_blank");
      if (win) {
        // Show thank you message when compose window opens
        toast.success("Thank you for the Mail! 📧", {
          description: "Gmail has opened - ready for you to send your message",
        });
      } else {
        // Fallback if popup blocked
        alert("Gmail could not be opened. Please visit https://mail.google.com or email: " + email);
      }
    } catch (error) {
      console.error("Error opening Gmail:", error);
      toast.error("Could not open Gmail", {
        description: "Please email: " + email,
      });
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleEmailClick}
        className="inline-flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-lg transition-colors duration-200 hover:bg-zinc-100/80 dark:hover:bg-white/[0.06] text-zinc-700 dark:text-zinc-300"
        aria-label={`Send email to ${email}`}
        title={`Send email to ${email}`}
      >
        <Mail className="w-4 sm:w-5 h-4 sm:h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleEmailClick}
      className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
      aria-label={`Send email to ${email}`}
    >
      <Mail className="w-5 h-5" />
      {showLabel && <span>Contact</span>}
    </button>
  );
}

