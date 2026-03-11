"use client";

import { motion } from "framer-motion";

const PATH_COUNT = 28;
const VIEWBOX = "0 0 696 316";
const CURTAIN_END_MS = 750;

function PathLayer({ position }: { position: number }) {
  const paths = Array.from({ length: PATH_COUNT }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.4 + i * 0.025,
    opacity: 0.015 + (i / PATH_COUNT) * 0.03,
    duration: 32 + (i / PATH_COUNT) * 16,
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
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
            key={`${position}-${path.id}`}
            d={path.d}
            stroke="rgb(255,255,255)"
            strokeWidth={path.width}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: path.opacity,
            }}
            transition={{
              delay: CURTAIN_END_MS / 1000,
              duration: path.duration,
              repeat: Infinity,
              ease: "linear",
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
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <PathLayer position={1} />
        <PathLayer position={-1} />
      </div>
    </div>
  );
}
