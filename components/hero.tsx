"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { BackgroundPaths } from "./background-paths";

const EASE = [0.16, 1, 0.3, 1] as const;
const S = 0.72;
const FALLBACK_BIO = "Frontend · open source · game development.\nMadeira, Portugal. Open to collaborations.";

export function Hero() {
  const [bio, setBio] = useState(FALLBACK_BIO);

  useEffect(() => {
    fetch("https://api.github.com/users/junerhobart")
      .then((r) => r.json())
      .then((u) => { if (u.bio) setBio(u.bio); })
      .catch(() => {});
  }, []);
  return (
    <section
      id="hero"
      style={{
        height: "100svh",
        minHeight: 560,
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--bg)",
        zIndex: 1,
      }}
    >
      <BackgroundPaths />
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#1a1a1a",
          zIndex: 5,
        }}
        initial={{ clipPath: "inset(0% 0% 0% 0% round 0 0 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 100% 0% round 0 0 60% 60%)" }}
        transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 800,
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: S, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h1
            style={{
              fontFamily: "var(--font)",
              fontSize: 50,
              fontWeight: 600,
              lineHeight: "61px",
              color: "#ffffff",
              margin: "0 0 2px",
            }}
          >
            June Hobart
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: S + 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          style={{
            fontFamily: "var(--font)",
            fontSize: 16,
            fontWeight: 400,
            lineHeight: 1.65,
            color: "#b0b0b0",
            maxWidth: 420,
            margin: "2rem 0 0",
            whiteSpace: "pre-line",
          }}
        >
          {bio}
        </motion.p>

      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: "rgba(255,255,255,0.08)",
          zIndex: 2,
        }}
      />
    </section>
  );
}
