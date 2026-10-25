"use client";

import { Fragment, useEffect, useState } from "react";

/* The thesis in motion: the signal blue walks DESIGNED -> BUILT -> OWNED.
   Server render and reduced motion both hold on BUILT, the original
   static treatment, so there is no hydration flash or layout shift. */

const LINES = ["DESIGNED BY US.", "BUILT BY US.", "OWNED BY US."];
const STEP_MS = 2500;

export default function HeroHeadline() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % LINES.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <h1 className="rise-in rise-in-delay-1 type-extended mt-6 max-w-5xl text-display uppercase">
      {LINES.map((line, i) => (
        <Fragment key={line}>
          {i > 0 && <br />}
          <span
            className={`transition-colors duration-700 ${
              i === active ? "text-signal-bright" : ""
            }`}
          >
            {line}
          </span>
        </Fragment>
      ))}
    </h1>
  );
}
