"use client";

import { motion } from "framer-motion";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import type { Repo } from "./github-section";

const LANG_COLORS: Record<string, string> = {
  Java:       "#b07219",
  Lua:        "#000080",
  "C#":       "#178600",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python:     "#3572A5",
  CSS:        "#563d7c",
  HTML:       "#e34c26",
  Rust:       "#dea584",
  Go:         "#00add8",
};

function titleCase(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function ProjectsList({ repos }: { repos: Repo[] }) {
  const projects = repos;

  return (
    <div>
      {projects.map((repo, i) => (
        <motion.a
          key={repo.name}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: i * 0.04, ease: [0.21, 0.47, 0.32, 0.98] as const }}
          whileHover={{ x: 6 }}
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "1.5rem",
            padding: "1.1rem 0",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            textDecoration: "none",
            transition: "border-color 150ms",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", minWidth: 0 }}>
            <span
              style={{
                fontFamily: "var(--font)",
                fontSize: 16,
                fontWeight: 500,
                color: "#ddd",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {titleCase(repo.name)}
            </span>
            {repo.description && (
              <span
                style={{
                  fontFamily: "var(--font)",
                  fontSize: 13,
                  color: "#444",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {repo.description}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flexShrink: 0 }}>
            {repo.language && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font)", fontSize: 12, color: "#444" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: LANG_COLORS[repo.language] ?? "#555", display: "inline-block" }} />
                {repo.language}
              </span>
            )}
            {repo.stargazers_count > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", fontFamily: "var(--font)", fontSize: 12, color: "#444" }}>
                <StarRounded style={{ fontSize: 12 }} />
                {repo.stargazers_count}
              </span>
            )}
            <ArrowOutwardRounded style={{ fontSize: 14, color: "#333" }} />
          </div>
        </motion.a>
      ))}
    </div>
  );
}
