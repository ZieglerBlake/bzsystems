"use client";

import { useEffect, useState } from "react";

/* Blake's phased-build entrance: shutters assemble, blueprint grid and
   target rings phase in, energy rails draw, the core flashes, beams and
   the security scan sweep, and the BZ scene locks in. Plays ONCE per
   session (~3.8s + hold), any input skips, never mounts under
   prefers-reduced-motion. Styles live in globals.css under .pbi. */

const CYCLE_MS = 3800;
const HOLD_MS = 700;
const FADE_MS = 450;

export default function PhasedBuildIntro() {
  const [active, setActive] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("bz-boot") === "1") return;
    sessionStorage.setItem("bz-boot", "1");
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    let fadeTimer = 0;
    let endTimer = 0;
    let started = false;

    const beginFade = () => {
      if (started) return;
      started = true;
      setFading(true);
      endTimer = window.setTimeout(() => setActive(false), FADE_MS + 60);
    };

    fadeTimer = window.setTimeout(beginFade, CYCLE_MS + HOLD_MS);
    const skip = () => beginFade();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });

    return () => {
      clearTimeout(fadeTimer);
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
      className={`pbi fixed inset-0 z-50 transition-opacity ease-out ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
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
