import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quiver Quantitative market intelligence dashboard";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0F19",
          color: "#F8FAFC",
          padding: "54px",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 800 }}>Quiver Quantitative</div>
          <div style={{ color: "#00D4FF", fontSize: 22 }}>Alternative Data Intelligence</div>
        </div>
        <div>
          <div style={{ maxWidth: 840, fontSize: 72, lineHeight: 1.02, fontWeight: 900 }}>
            Alternative Data Meets Quantitative Intelligence
          </div>
          <div style={{ marginTop: 26, maxWidth: 780, color: "#CBD5E1", fontSize: 28, lineHeight: 1.35 }}>
            Insider trading, congressional disclosures, macro data, sentiment, portfolios, and backtesting in one institutional research platform.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          {["SEC filings", "Congress trades", "AI signals", "Quant lab"].map((item) => (
            <div
              key={item}
              style={{
                border: "1px solid rgba(0, 212, 255, 0.35)",
                background: "rgba(0, 212, 255, 0.10)",
                color: "#BFF4FF",
                borderRadius: 8,
                padding: "14px 18px",
                fontSize: 22,
                fontWeight: 700
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
