"use client";

import { useEffect, useRef } from "react";

/** Keeps the Components page where it opened.
 *
 *  The Command Menu demo (cmdk) scrolls its picked row into view when it
 *  mounts, which drags the whole page down to it. Until the reader scrolls,
 *  clicks or types, any scroll the page does on its own goes back: to the top,
 *  or to the component named in the address (localhost:3100/#button). The
 *  component itself is left as it is. Off for the picture scripts (a browser
 *  driven by Playwright), which scroll the page themselves. */
export function KeepTop({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = ref.current?.firstElementChild as HTMLElement | null;
    if (!scroller || navigator.webdriver) return;
    let acted = false;
    const act = () => {
      acted = true;
    };
    const home = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target) target.scrollIntoView({ block: "start" });
      else scroller.scrollTop = 0;
    };
    const onScroll = () => {
      if (!acted) home();
    };
    const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    for (const e of events) window.addEventListener(e, act, { passive: true, capture: true });
    scroller.addEventListener("scroll", onScroll, { passive: true });
    // The children mount first, so the jump may already have happened.
    home();
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      for (const e of events) window.removeEventListener(e, act, { capture: true });
    };
  }, []);

  return (
    <div ref={ref} className="h-full">
      {children}
    </div>
  );
}
