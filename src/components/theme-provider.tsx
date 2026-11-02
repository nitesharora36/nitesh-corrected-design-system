"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Light and dark, set the same way as in the product: next-themes writes
 *  data-theme="paper" (light) or data-theme="ink" (dark) on the html element,
 *  and every token in styles/theme-tokens.css follows it. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      themes={["ink", "paper"]}
      value={{ dark: "ink", light: "paper" }}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
