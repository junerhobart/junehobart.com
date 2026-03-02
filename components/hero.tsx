"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#275180",
          zIndex: 5,
        }}
        initial={{ clipPath: "inset(0% 0% 0% 0% round 0 0 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 100% 0% round 0 0 60% 60%)" }}
        transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
      />

      <motion.div
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          translateX: "-50%",
          width: 3,
          height: 72,
          zIndex: 2,
          overflow: "hidden",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <motion.div
          style={{ width: "100%", height: "100%", backgroundColor: "#275180" }}
          animate={{ y: ["-100%", "0%", "0%", "100%"] }}
          transition={{
            duration: 2.2,
            times: [0, 0.38, 0.62, 1],
            repeat: Infinity,
            repeatDelay: 1.0,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </motion.div>

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
            color: "#555",
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
