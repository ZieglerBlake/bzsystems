import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let body: { name?: unknown; email?: unknown; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 200) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Contact unavailable" }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "BZ Systems <onboarding@resend.dev>",
    to: "blake@bzsystems.io",
    replyTo: email,
    subject: `bzsystems.io contact — ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
