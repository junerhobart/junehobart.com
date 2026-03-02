"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE_TAGS = new Set(["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT", "LABEL"]);
const TEXT_TAGS = new Set(["P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "LI", "STRONG", "EM", "BLOCKQUOTE"]);

type CursorState = "default" | "hover" | "text" | "down";

function getCursorState(el: HTMLElement, isDown: boolean): CursorState {
  if (isDown) return "down";
  if (INTERACTIVE_TAGS.has(el.tagName) || !!el.closest("a") || !!el.closest("button")) return "hover";
  if (TEXT_TAGS.has(el.tagName)) return "text";
  return "default";
}

const STATES: Record<CursorState, { width: number; height: number; borderRadius: number; border: string; bg: string }> = {
  default: { width: 28, height: 28, borderRadius: 999, border: "none",                         bg: "#275180" },
  hover:   { width: 40, height: 40, borderRadius: 999, border: "4px solid #275180", bg: "transparent" },
  text:    { width: 3,  height: 32, borderRadius: 999,   border: "none",                         bg: "#275180" },
  down:    { width: 16, height: 16, borderRadius: 999, border: "none",                         bg: "#275180" },
};

export function Cursor() {
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [isDown, setIsDown] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 650, damping: 42, mass: 0.3 });
  const y = useSpring(rawY, { stiffness: 650, damping: 42, mass: 0.3 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
      setState(getCursorState(e.target as HTMLElement, isDown));
    };
    const onDown = (e: MouseEvent) => {
      setIsDown(true);
      setState(getCursorState(e.target as HTMLElement, true));
    };
    const onUp = (e: MouseEvent) => {
      setIsDown(false);
      setState(getCursorState(e.target as HTMLElement, false));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", () => setVisible(false));
    document.documentElement.addEventListener("mouseenter", () => setVisible(true));

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [rawX, rawY, visible, isDown]);

  const s = STATES[state];

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <motion.div
        animate={{
          width: s.width,
          height: s.height,
          borderRadius: s.borderRadius,
          backgroundColor: s.bg,
          border: s.border,
          opacity: visible ? 1 : 0,
        }}
        transition={
          isDown
            ? { duration: 0.07, ease: "easeIn" }
            : { type: "spring", stiffness: 300, damping: 18, mass: 0.5 }
        }
      />
    </motion.div>
  );
}
