"use client";

import { useEffect, useState } from "react";

/* Blake's phased-build entrance: shutters assemble, blueprint grid and
   target rings phase in, energy rails draw, the core flashes, beams and
   the security scan sweep, and the BZ scene locks in. Plays on EVERY
   visit (~3.8s + hold), any input skips, never mounts under
   prefers-reduced-motion. Styles live in globals.css under .pbi. */

const CYCLE_MS = 3800;
const HOLD_MS = 700;
const FADE_MS = 450;

// Plays only on a fresh document load of the home page. On a fresh load
// the server-rendered overlay is already in the DOM when this component
// hydrates; on an in-site route transition there is no server HTML, so
// the intro stays quiet. Section deep links (/#contact) never gate.

export default function PhasedBuildIntro() {
  // Rendered in the initial server HTML so the overlay is painted before
  // hydration: no flash of the page underneath. CSS handles the fade-out
  // (and hides it entirely under prefers-reduced-motion); JS only skips
  // early and removes the node once it's invisible.
  const [active, setActive] = useState(() => {
    if (typeof window === "undefined") return true;
    return !!document.querySelector(".pbi") && !window.location.hash;
  });
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.location.hash
    ) {
      setActive(false);
      return;
    }
    let endTimer = window.setTimeout(
      () => setActive(false),
      CYCLE_MS + HOLD_MS + FADE_MS + 120,
    );
    const skip = () => {
      setSkipped(true);
      clearTimeout(endTimer);
      endTimer = window.setTimeout(() => setActive(false), FADE_MS + 60);
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });

    return () => {
      clearTimeout(endTimer);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
    };
  }, [active]);

  if (!active) return null;
  return (
    <div
      aria-hidden
      className={`pbi fixed inset-0 z-50 ${skipped ? "pbi-out" : ""}`}
    >
      <div className="pbi-layer pbi-scene" />
      <div className="pbi-layer pbi-shutter pbi-top" />
      <div className="pbi-layer pbi-shutter pbi-bottom" />
      <div className="pbi-layer pbi-shutter pbi-left" />
      <div className="pbi-layer pbi-shutter pbi-right" />
      <div className="pbi-layer pbi-grid" />
      <div className="pbi-layer pbi-rings" />
      <span className="pbi-rail pbi-r1" />
      <span className="pbi-rail pbi-r2" />
      <span className="pbi-rail pbi-r3" />
      <div className="pbi-layer pbi-core" />
      <div className="pbi-beam" />
      <div className="pbi-beam pbi-b" />
      <div className="pbi-layer pbi-frame" />
      <div className="pbi-scan" />
    </div>
  );
}
