"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-sm border border-line bg-panel px-4 py-3 text-body text-ink placeholder:text-ink-faint focus:border-signal focus:outline-none transition-colors duration-200";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("contact request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="font-mono text-label uppercase text-signal-bright">
        ▸ Message sent and received. We will get back to you ASAP.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-label uppercase text-ink-faint">Name</span>
          <input
            required
            maxLength={200}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-label uppercase text-ink-faint">Email</span>
          <input
            type="email"
            required
            maxLength={254}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@company.com"
            className={inputClass}
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-label uppercase text-ink-faint">Message</span>
        <textarea
          required
          maxLength={5000}
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Briefly describe your inquiry and any relevant background."
          className={`${inputClass} resize-y`}
        />
      </label>
      <div className="flex items-center gap-6">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-sm border border-signal px-8 py-3 font-mono text-label uppercase text-ink transition-all duration-200 hover:bg-signal hover:shadow-glow disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : "Send"}
        </button>
        {status === "error" && (
          <p role="alert" className="font-mono text-label text-ink-dim">
            Something went wrong. Please email us directly at{" "}
            <a href="mailto:contact@bzsystems.io" className="text-signal-bright underline">
              contact@bzsystems.io
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
