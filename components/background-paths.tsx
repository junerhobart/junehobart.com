"use client";

import { motion } from "framer-motion";

const VIEWBOX = "0 0 696 316";
const EASE_SMOOTH = [0.45, 0, 0.55, 1] as const; // ease-in-out, smooth at ends

function flowPath(position: number, i: number): string {
  const p = position;
  const x1 = 380 - i * 5 * p;
  const x2 = 312 - i * 5 * p;
  const x3 = 152 - i * 5 * p;
  const x4 = 616 - i * 5 * p;
  const x5 = 684 - i * 5 * p;
  const y1 = 189 + i * 6;
  const y2 = 216 - i * 6;
  const y3 = 343 - i * 6;
  const y4 = 470 - i * 6;
  const y5 = 875 - i * 6;
  return `M-${x1} -${y1}C-${x1} -${y1} -${x2} ${y2} ${x3} ${y3}C${x4} ${y4} ${x5} ${y5} ${x5} ${y5}`;
}

function FlowLayer({ position }: { position: number }) {
  const count = 20;
  const paths = Array.from({ length: count }, (_, i) => ({
    id: i,
    d: flowPath(position, i),
    width: 0.45 + i * 0.02,
    opacity: 0.04 + (i / count) * 0.06,
    duration: 28 + (i / count) * 14,
    delay: i * 0.4,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg
        width="100%"
        height="100%"
        viewBox={VIEWBOX}
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        style={{ overflow: "visible" }}
      >
        {paths.map((path) => (
          <motion.path
            key={`flow-${position}-${path.id}`}
            d={path.d}
            stroke="rgb(255,255,255)"
            strokeWidth={path.width}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: path.opacity }}
            transition={{
              delay: path.delay,
              duration: path.duration,
              repeat: Infinity,
              ease: EASE_SMOOTH,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function WrapLayer() {
  const wraps = [
    { id: 0, d: "M -50,0 Q 348,-120 742,0", duration: 32, delay: 0 },
    { id: 1, d: "M 742,316 Q 348,436 -50,316", duration: 35, delay: 3 },
    { id: 2, d: "M 0,-80 Q 400,158 0,396", duration: 30, delay: 1.5 },
    { id: 3, d: "M 696,-80 Q 296,158 696,396", duration: 33, delay: 4 },
  ].map((p) => ({
    ...p,
    width: 0.4,
    opacity: 0.045,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg
        width="100%"
        height="100%"
        viewBox={VIEWBOX}
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        style={{ overflow: "visible" }}
      >
        {wraps.map((path) => (
          <motion.path
            key={`wrap-${path.id}`}
            d={path.d}
            stroke="rgb(255,255,255)"
            strokeWidth={path.width}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: path.opacity }}
            transition={{
              delay: path.delay,
              duration: path.duration,
              repeat: Infinity,
              ease: EASE_SMOOTH,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <FlowLayer position={1} />
        <FlowLayer position={-1} />
        <WrapLayer />
      </div>
    </div>
  );
}
