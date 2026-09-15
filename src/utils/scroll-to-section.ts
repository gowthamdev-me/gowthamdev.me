/**
 * Smoothly scrolls to a section by ID and removes the hash from the URL
 * so that "#about" never shows in the address bar.
 *
 * @param sectionId - The element `id` to scroll to (without `#`)
 * @param offset    - Optional px offset from the top (defaults to 80 to clear the sticky header)
 */
export function scrollToSection(sectionId: string, offset = 80): void {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: "smooth" });

  // Remove the hash from the URL without creating a browser history entry
  // so the address bar never shows "#about" etc.
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

/**
 * Parses a hash-style href like "/#about" or "#about" and returns the section id.
 * Returns null if the href has no hash.
 */
export function getSectionId(href: string): string | null {
  const hashIdx = href.indexOf("#");
  if (hashIdx === -1) return null;
  return href.slice(hashIdx + 1) || null;
}
