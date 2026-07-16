import { NextResponse } from "next/server";
import { Resend } from "resend";

const PRODUCTS = new Set(["skillshelf", "license-api"]);

export async function POST(req: Request) {
  let body: { email?: unknown; product?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const product = typeof body.product === "string" ? body.product : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!PRODUCTS.has(product)) {
    return NextResponse.json({ error: "Unknown product" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(`RESEND_API_KEY unset — waitlist signup dropped (${product}: ${email})`);
    return NextResponse.json({ error: "Waitlist unavailable" }, { status: 503 });
  }

  try {
    const resend = new Resend(apiKey);
    // onboarding@resend.dev is Resend's sandbox sender; swap to a
    // bzsystems.io address once the domain is verified in Resend.
    const { error } = await resend.emails.send({
      from: "BZ Systems <onboarding@resend.dev>",
      to: "blake@bzsystems.io",
      subject: `Waitlist signup: ${product}`,
      text: `${email} joined the ${product} waitlist.`,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend send failed:", err);
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
}
