import { ImageResponse } from "next/og";

export const alt = "Nani Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b", // Tailwind background (zinc-950)
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
          border: "1px solid #27272a", // Tailwind border (zinc-800)
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
          <svg width="80" height="80" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" fill="#09090b" rx="112" stroke="#ffffff" strokeWidth="24" />
            <path d="M160 160 L160 352 L224 352 L224 224 L352 352 L352 160 L288 160 L288 288 Z" fill="#ffffff" />
          </svg>
          <h1 style={{ fontSize: "80px", fontWeight: 800, marginLeft: "30px", letterSpacing: "-0.05em" }}>
            NANI SYSTEMS
          </h1>
        </div>
        <p style={{ fontSize: "40px", color: "#a1a1aa", marginTop: 0, fontWeight: 500 }}>
          Enterprise Software Engineering
        </p>
      </div>
    ),
    { ...size }
  );
}
