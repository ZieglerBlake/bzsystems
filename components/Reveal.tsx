"use client";

import { useEffect, useRef } from "react";

/* Fade + 12px rise on scroll-in (FOUNDING-BRIEF motion budget).
   Content is visible by default: the hidden state is only applied after
   hydration, only to elements still below the fold, and only when the
   user allows motion — reveals enhance, never gate. */
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.classList.add("reveal-pending");
    // Huge top rootMargin: anything at or above the viewport counts as
    // intersecting, so anchor jumps (e.g. /vendor-reality-check#get-your-verdict)
    // that skip past a section still reveal it instead of leaving it hidden.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          io.disconnect();
        }
      },
      { rootMargin: "9999px 0px -10% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
