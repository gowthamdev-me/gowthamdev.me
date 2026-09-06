"use client";

import { useEffect, useState } from "react";

const DEFAULT_WORDS = ["Web Developer", "Vibe Coder"];

interface TypingAnimationProps {
  className?: string;
}

export function TypingAnimation({ className = "" }: TypingAnimationProps) {
  const [words, setWords] = useState<string[]>(DEFAULT_WORDS);
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch words from profile (non-blocking — falls back to defaults)
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const w = data?.profile?.typingWords;
        if (Array.isArray(w) && w.length > 0) setWords(w);
      })
      .catch(() => {});
  }, []);

  const rotatingText = words[wordIndex % words.length] ?? "";
  const displayedText = rotatingText.slice(0, visibleCount);

  useEffect(() => {
    if (!rotatingText) return;
    const isComplete = visibleCount >= rotatingText.length;
    const isEmpty = visibleCount <= 0 && isDeleting;
    const delay = isComplete ? 1200 : isEmpty ? 80 : isDeleting ? 55 : 95;

    const timer = window.setTimeout(() => {
      if (!isDeleting && isComplete) { setIsDeleting(true); return; }
      if (isDeleting && isEmpty) {
        setIsDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
        return;
      }
      setVisibleCount((c) => Math.max(0, Math.min(rotatingText.length, c + (isDeleting ? -1 : 1))));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isDeleting, rotatingText, visibleCount, words.length]);

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap ${className}`}
      aria-live="polite"
      aria-label={`I'\''m ${rotatingText}`}
    >
      <span style={{ marginRight: "0.3em" }}>I&apos;m</span>

      {displayedText.split("").map((character, index) => (
        <span
          key={`${wordIndex}-${index}-${character}`}
          style={{ display: "inline-block", animation: "typing-char-pop 95ms steps(1, end) both" }}
        >
          {character === " " ? "\u00a0" : character}
        </span>
      ))}

      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "2px",
          height: "1em",
          marginLeft: "2px",
          background: "#FA0143",
          verticalAlign: "middle",
          animation: "typing-caret-blink 0.8s steps(1, end) infinite",
        }}
      />
      <style>{`
        @keyframes typing-char-pop {
          from { opacity: 0; transform: translateY(0.08em); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typing-caret-blink { 50% { opacity: 0; } }
      `}</style>
    </span>
  );
}
