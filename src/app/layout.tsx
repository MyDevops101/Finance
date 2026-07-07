import type { Metadata, Viewport } from "next";

import "@/app/globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Quiver Quantitative | Alternative Data Investment Intelligence",
    template: "%s | Quiver Quantitative"
  },
  description:
    "Alternative data, quantitative research, insider trading, congressional trading, market intelligence, and AI-powered investment signals.",
  keywords: [
    "quantitative investing",
    "insider trading tracker",
    "congressional trading tracker",
    "alternative data investing",
    "stock market intelligence",
    "quantitative research"
  ],
  authors: [{ name: "Quiver Quantitative" }],
  creator: "Quiver Quantitative",
  openGraph: {
    type: "website",
    url: appUrl,
    siteName: "Quiver Quantitative",
    title: "Quiver Quantitative",
    description:
      "Institutional-grade market intelligence using public filings, macro data, sentiment, portfolio analytics, and quant models.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Quiver Quantitative market intelligence dashboard"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiver Quantitative",
    description:
      "Alternative data meets quantitative intelligence for investors, traders, and researchers.",
    images: ["/opengraph-image"]
  }
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
