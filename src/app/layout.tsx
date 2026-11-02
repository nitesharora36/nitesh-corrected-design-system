import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";

import { InputModality } from "@/components/input-modality";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteBar } from "@/site/site-bar";

// Inter 4.1 variable (opsz 14 to 32, wght 100 to 900) carries every Inter role
// in the Figma; styles/typography-tokens.css pins the optical size per family.
const interVariable = localFont({
  src: [{ path: "./fonts/InterVariable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter-variable",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

// DM Mono Medium: the four DM Mono styles (machine data, uppercase).
const dmMono = localFont({
  src: [{ path: "./fonts/DMMono-Medium.woff2", weight: "500", style: "normal" }],
  variable: "--font-dm-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Merlin Nitesh's New Design System",
  description: "Every component and token of Merlin Nitesh's New Design System, light and dark.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${interVariable.variable} ${dmMono.variable}`}>
      <body className="font-sans antialiased">
        {/* Focus rings for keyboard users only, as in the product's layout. */}
        <InputModality />
        <ThemeProvider>
          <div className="relative flex h-screen flex-col overflow-hidden bg-bg-white-0">
            <SiteBar />
            <div className="min-h-0 flex-1">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
