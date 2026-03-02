"use client";

import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import SportsEsportsRounded from "@mui/icons-material/SportsEsportsRounded";
import PaletteRounded from "@mui/icons-material/PaletteRounded";
import CodeRounded from "@mui/icons-material/CodeRounded";
import ExtensionRounded from "@mui/icons-material/ExtensionRounded";
import DataObjectRounded from "@mui/icons-material/DataObjectRounded";
import AccountTreeRounded from "@mui/icons-material/AccountTreeRounded";
import TerminalRounded from "@mui/icons-material/TerminalRounded";
import SmartToyRounded from "@mui/icons-material/SmartToyRounded";

const skills = [
  { name: "Lua",           pct: 98, Icon: SportsEsportsRounded },
  { name: "UI/UX",         pct: 75, Icon: PaletteRounded       },
  { name: "C#",            pct: 35, Icon: CodeRounded           },
  { name: "Java",          pct: 50, Icon: ExtensionRounded      },
  { name: "TypeScript",    pct: 30, Icon: DataObjectRounded     },
  { name: "System Design", pct: 70, Icon: AccountTreeRounded    },
  { name: "Python",        pct: 50, Icon: SmartToyRounded       },
  { name: "Unix",          pct: 60, Icon: TerminalRounded       },
];

const radarData = skills.map(({ name, pct }) => ({ axis: name, value: pct }));

const inView = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.45, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
});


export function Skills() {
  return (
    <section
      id="skills"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "6rem 2rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", width: "100%" }}>

        <motion.div
          {...inView(0)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3.5rem",
          }}
        >
          <h2 style={{ fontFamily: "var(--font)", fontSize: 38, fontWeight: 500, color: "#fafafa", margin: 0 }}>
            Skills
          </h2>
          <div style={{ width: 56, height: 0, borderTop: "2px solid rgba(153,153,153,0.5)" }} />
        </motion.div>

        {/* Radar + skill list */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "3rem", alignItems: "center" }}>
          <motion.div {...inView(0.06)}>
            <ResponsiveContainer width="100%" height={460}>
              <RadarChart
                data={radarData}
                outerRadius="66%"
                margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
              >
                <PolarGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="0" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "#555", fontSize: 12, fontFamily: "var(--font-inter, Inter, sans-serif)" }}
                  tickLine={false}
                />
                <Radar
                  dataKey="value"
                  stroke="#275180"
                  strokeWidth={1.5}
                  fill="#275180"
                  fillOpacity={0.18}
                  dot={{ fill: "#275180", r: 3, strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {skills.map(({ name, pct, Icon }, i) => (
              <motion.div
                key={name}
                {...inView(0.08 + i * 0.06)}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                style={{ display: "flex", alignItems: "center", gap: "0.9rem", cursor: "default" }}
              >
                <Icon style={{ fontSize: 32, color: "#4a4a4a", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                    <span style={{ fontFamily: "var(--font)", fontSize: 14, fontWeight: 500, color: "#bbb" }}>{name}</span>
                    <span style={{ fontFamily: "var(--font)", fontSize: 12, color: "#444" }}>{pct}%</span>
                  </div>
                  <div style={{ height: 2, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 999, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: "0%" }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: "100%", backgroundColor: "#275180", borderRadius: 999 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
