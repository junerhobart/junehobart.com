"use client";

import { motion } from "framer-motion";

type Contribution = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

const LEVEL_COLORS: Record<number, string> = {
  0: "rgba(255,255,255,0.05)",
  1: "#0d1a2b",
  2: "#163350",
  3: "#275180",
  4: "#3d78bf",
};

interface Props {
  contributions: Contribution[];
  total: number;
  compact?: boolean;
}

export function ContributionsGrid({ contributions, total, compact }: Props) {
  const weeks: Contribution[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}>
        {!compact && (
          <h2 style={{
            fontFamily: "var(--font-sora)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#f0f0f0",
          }}>
            Contributions
          </h2>
        )}
        {total > 0 && (
          <span style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.78rem",
            color: "rgba(240,240,240,0.28)",
            letterSpacing: "0.05em",
          }}>
            {total} contributions in the past year
          </span>
        )}
      </div>

      {weeks.length > 0 ? (
        <div style={{ display: "flex", gap: "3px", overflowX: "auto", paddingBottom: "0.5rem" }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {week.map((day, di) => (
                <motion.div
                  key={di}
                  initial={{ opacity: 0, scale: 0.3 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: wi * 0.01 + di * 0.003, ease: "easeOut" }}
                  title={`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    backgroundColor: LEVEL_COLORS[day.level],
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          height: "5rem",
          display: "flex",
          alignItems: "center",
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.8rem",
          color: "rgba(240,240,240,0.18)",
        }}>
          Loading activity...
        </div>
      )}

      <div style={{
        marginTop: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}>
        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.68rem", color: "rgba(240,240,240,0.2)" }}>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: LEVEL_COLORS[l] }} />
        ))}
        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.68rem", color: "rgba(240,240,240,0.2)" }}>More</span>
      </div>
    </motion.div>
  );

  if (compact) return inner;

  return (
    <section
      id="contributions"
      style={{ padding: "7rem 2rem", backgroundColor: "#0a0a0a" }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>{inner}</div>
    </section>
  );
}
