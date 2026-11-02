"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const PAGES = [
  { href: "/", label: "Components" },
  { href: "/foundations", label: "Foundations" },
];

/** The gallery's top bar: its name and its two pages. */
export function SiteBar() {
  const path = usePathname();
  return (
    <header className="flex h-space-48 shrink-0 items-center gap-space-24 border-b border-stroke-soft-200 bg-bg-white-0 px-space-32">
      <span className="text-label-sm text-text-strong-950">Merlin Nitesh&apos;s New Design System</span>
      <nav aria-label="Pages" className="flex gap-space-4">
        {PAGES.map((p) => {
          const on = path === p.href;
          return (
            <Link
              key={p.href}
              href={p.href}
              aria-current={on ? "page" : undefined}
              className={cn(
                "rounded-corner-6 px-space-8 py-space-4 text-label-sm",
                on ? "bg-bg-weak-50 text-text-strong-950" : "text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950",
              )}
            >
              {p.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
