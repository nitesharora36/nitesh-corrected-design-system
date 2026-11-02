"use client";

/**
 * Focus rings only for keyboard navigation (Nitesh, 23 Oct 2026: "it is only
 * when we tap on the tab to go manually, else it shouldn't come, but all the
 * other states, hover, active and more should come... for the overall
 * components").
 *
 * Browsers also show :focus-visible when a menu, list or dialog hands focus
 * back to its button after a mouse pick. This marks how the person is moving
 * on <html>: data-input="keyboard" after Tab or an arrow key, "pointer" after
 * a click or a tap. styles/ds.css then keeps the focus state (ds-focus, and
 * Tailwind's focus-visible) off while it reads "pointer". Hover and pressed
 * states are untouched. Mounted once, in app/layout.tsx.
 */

import { useEffect } from "react";

const NAVIGATION_KEYS = new Set(["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"]);

export function InputModality() {
  useEffect(() => {
    const html = document.documentElement;
    const onKey = (e: KeyboardEvent) => {
      if (NAVIGATION_KEYS.has(e.key)) html.dataset.input = "keyboard";
    };
    const onPointer = () => {
      html.dataset.input = "pointer";
    };
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("pointerdown", onPointer, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("pointerdown", onPointer, true);
    };
  }, []);
  return null;
}

/** The person is moving with the keyboard (or has not used a pointer yet). */
export const usingKeyboard = () => typeof document === "undefined" || document.documentElement.dataset.input !== "pointer";
