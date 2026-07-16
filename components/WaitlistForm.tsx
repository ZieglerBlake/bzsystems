"use client";

import { useState } from "react";
import Button from "./Button";

type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistForm({
  product,
}: {
  product: "skillshelf" | "license-api";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product }),
      });
      if (!res.ok) throw new Error("waitlist request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-body text-ink" role="status">
        You&rsquo;re on the list — we&rsquo;ll email you when it&rsquo;s ready.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-label="Email address"
          className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-ui text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Joining…" : "Join the waitlist"}
        </Button>
      </div>
      {status === "error" && (
        <p role="alert" className="text-ui text-accent-ink">
          Something went wrong — try again, or email blake@bzsystems.io.
        </p>
      )}
    </form>
  );
}
