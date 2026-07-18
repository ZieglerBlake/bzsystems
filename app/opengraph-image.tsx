import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/* OG card in the site's design language: bright control room x schematic.
   Rebuilds the hero typographically so it never goes stale against copy
   changes. Fonts are committed under assets/fonts (OFL). */

export const alt =
  "BZ Systems LLC. Designed by us. Built by us. Owned by us.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [archivo, mono] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Archivo-ExtraBold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/JetBrainsMono-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#f7f8f6",
          padding: "64px 72px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: 22,
            letterSpacing: "0.08em",
            color: "rgba(16, 19, 18, 0.64)",
          }}
        >
          BZ SYSTEMS LLC / INDEPENDENT SOFTWARE STUDIO / COLUMBUS, OH
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
            fontFamily: "Archivo",
            fontSize: 104,
            lineHeight: 0.98,
            letterSpacing: "0.01em",
            color: "#101312",
          }}
        >
          <div style={{ display: "flex" }}>DESIGNED BY US.</div>
          <div style={{ display: "flex", color: "#15529e" }}>BUILT BY US.</div>
          <div style={{ display: "flex" }}>OWNED BY US.</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            width: "100%",
            height: 4,
            background: "#1e70cd",
            boxShadow: "0 -8px 28px rgba(30, 112, 205, 0.18)",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: archivo, weight: 800, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}
