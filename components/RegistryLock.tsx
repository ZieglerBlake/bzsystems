"use client";

import { useState } from "react";

/* Decorative gate for the ventures registry. Not real auth: the input
   goes nowhere and every attempt is refused while the registry is in
   build. Swap for a real check when the lineup publishes. */

export default function RegistryLock() {
  const [denied, setDenied] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDenied(true);
      }}
      className="mt-12 max-w-xl rounded-md border border-line bg-panel p-8"
    >
      <p className="font-mono text-label uppercase text-ink-dim">
        Restricted / key required
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="password"
          name="registry-key"
          aria-label="Registry key"
          placeholder="ENTER KEY"
          autoComplete="off"
          onChange={() => setDenied(false)}
          className="w-full rounded-sm border border-line bg-void px-4 py-3 font-mono text-label uppercase text-ink placeholder:text-ink-faint focus:border-signal focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-sm border border-signal px-8 py-3 font-mono text-label uppercase text-signal-bright transition-all duration-200 hover:bg-signal hover:text-panel hover:shadow-glow"
        >
          Unlock
        </button>
      </div>
      <p aria-live="polite" className="mt-4 font-mono text-label uppercase text-ink-faint">
        {denied
          ? "▸ ACCESS DENIED. THE REGISTRY IS SEALED WHILE IN BUILD."
          : "THE REGISTRY IS LOCKED UNTIL THE LINEUP PUBLISHES."}
      </p>
    </form>
  );
}
