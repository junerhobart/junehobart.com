"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE_TAGS = new Set(["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT", "LABEL"]);
const TEXT_TAGS = new Set(["P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "LI", "STRONG", "EM", "BLOCKQUOTE"]);

type CursorState = "default" | "hover" | "text" | "down";

function getStateFor(el: HTMLElement, isDown: boolean): CursorState {
  if (isDown) return "down";
  if (INTERACTIVE_TAGS.has(el.tagName) || !!el.closest("a") || !!el.closest("button")) return "hover";
  if (TEXT_TAGS.has(el.tagName)) return "text";
  return "default";
}

const STATES: Record<CursorState, { width: number; height: number; borderRadius: number; border: string; bg: string }> = {
  default: { width: 28, height: 28, borderRadius: 999, border: "none",                  bg: "#275180"      },
  hover:   { width: 40, height: 40, borderRadius: 999, border: "2.5px solid #275180",   bg: "transparent"  },
  text:    { width: 3,  height: 32, borderRadius: 999, border: "none",                  bg: "#275180"      },
  down:    { width: 16, height: 16, borderRadius: 999, border: "none",                  bg: "#275180"      },
};

const MAX_STRETCH = 1.7;
const SPEED_CAP   = 28;

export function Cursor() {
  const [hasPointer, setHasPointer] = useState(false);
  const [state, setState]     = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [isDown, setIsDown]   = useState(false);

  useEffect(() => {
    setHasPointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);
  const x = useSpring(rawX, { stiffness: 650, damping: 42, mass: 0.3 });
  const y = useSpring(rawY, { stiffness: 650, damping: 42, mass: 0.3 });

  // Always attached — tick decides whether to apply transform based on state
  const stretchRef    = useRef<HTMLDivElement>(null);
  const curStateRef   = useRef<CursorState>("default");

  const prevPos = useRef({ x: -200, y: -200, t: 0 });
  const velRef  = useRef({ sx: 1, sy: 1, curAngle: 0, targetAngle: 0 });

  useEffect(() => {
    if (!hasPointer) return;

    const loop = { isDown: false, visible: false, isSelectingText: false };
    let rafId = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const applyState = (next: CursorState) => {
      // When entering hover or down, snap stretch to 1 so the new size looks clean
      if (next === "hover" || next === "down") {
        velRef.current.sx = 1;
        velRef.current.sy = 1;
      }
      curStateRef.current = next;
      setState(next);
    };

    const tick = () => {
      const el = stretchRef.current;
      if (el) {
        const v   = velRef.current;
        const cur = curStateRef.current;

        if (cur === "text") {
          v.sx = 1;
          v.sy = 1;
          el.style.transform = "";
        } else {
          v.sx       = lerp(v.sx, 1, 0.18);
          v.sy       = lerp(v.sy, 1, 0.18);
          v.curAngle = lerp(v.curAngle, v.targetAngle, 0.22);
          if (v.sx > 1.01) {
            el.style.transform = `rotate(${v.curAngle}deg) scaleX(${v.sx}) scaleY(${v.sy})`;
          } else {
            el.style.transform = "";
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt  = Math.max(now - prevPos.current.t, 1);
      const dx  = e.clientX - prevPos.current.x;
      const dy  = e.clientY - prevPos.current.y;
      prevPos.current = { x: e.clientX, y: e.clientY, t: now };

      const speed = Math.sqrt(dx * dx + dy * dy) / dt * 16;

      if (speed > 0.8 && curStateRef.current !== "text") {
        const raw  = Math.atan2(dy, dx) * (180 / Math.PI);
        let diff   = raw - (velRef.current.targetAngle % 360);
        if (diff > 180)  diff -= 360;
        if (diff < -180) diff += 360;
        velRef.current.targetAngle += diff;

        const t       = Math.min(speed / SPEED_CAP, 1);
        const stretch = 1 + (MAX_STRETCH - 1) * t;
        velRef.current.sx = stretch;
        velRef.current.sy = 1 / stretch;
      }

      rawX.set(e.clientX);
      rawY.set(e.clientY);

      if (!loop.visible) { loop.visible = true; setVisible(true); }

      // Preserve text state while drag-selecting
      const next = loop.isSelectingText && loop.isDown
        ? "text"
        : getStateFor(e.target as HTMLElement, loop.isDown);
      applyState(next);
    };

    const onDown = (e: MouseEvent) => {
      loop.isDown = true;
      setIsDown(true);
      // If clicking on text, stay in text state (user is drag-selecting)
      const base = getStateFor(e.target as HTMLElement, false);
      loop.isSelectingText = base === "text";
      applyState(loop.isSelectingText ? "text" : "down");
    };

    const onUp = (e: MouseEvent) => {
      loop.isDown = false;
      loop.isSelectingText = false;
      setIsDown(false);
      applyState(getStateFor(e.target as HTMLElement, false));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    document.documentElement.addEventListener("mouseleave", () => setVisible(false));
    document.documentElement.addEventListener("mouseenter", () => setVisible(true));

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [rawX, rawY, hasPointer]);

  if (!hasPointer) return null;

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
      <div ref={stretchRef} style={{ display: "flex" }}>
        <motion.div
          animate={{
            width:           s.width,
            height:          s.height,
            borderRadius:    s.borderRadius,
            backgroundColor: s.bg,
            border:          s.border,
            opacity:         visible ? 1 : 0,
          }}
          transition={
            isDown
              ? { duration: 0.07, ease: "easeIn" }
              : { type: "spring", stiffness: 300, damping: 18, mass: 0.5 }
          }
        />
      </div>
    </motion.div>
  );
}
