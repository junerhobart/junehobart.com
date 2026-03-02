"use client";

import { motion } from "framer-motion";
import StarRounded from "@mui/icons-material/StarRounded";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import type { Repo } from "./github-section";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Java: "#b07219",
  Lua: "#000080",
  "C#": "#178600",
  Python: "#3572A5",
  Go: "#00ADD8",
};

interface Props {
  repos: Repo[];
}

export function GithubRepos({ repos }: Props) {
  if (repos.length === 0) return null;

  return (
    <div style={{ marginTop: "4rem" }}>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.68rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(240,240,240,0.22)",
          marginBottom: "1.5rem",
        }}
      >
        Repositories
      </motion.p>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {repos.map((repo, i) => (
          <motion.a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.4rem 0",
              borderTop: "1px solid rgba(240,240,240,0.06)",
              textDecoration: "none",
              gap: "1rem",
              transition: "background 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.paddingLeft = "0.5rem";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.paddingLeft = "0";
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.3rem" }}>
                <span style={{
                  fontFamily: "var(--font-sora)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "rgba(240,240,240,0.85)",
                  letterSpacing: "-0.01em",
                }}>
                  {repo.name}
                </span>
                {repo.language && (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.68rem",
                    color: "rgba(240,240,240,0.3)",
                  }}>
                    <span style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: LANG_COLORS[repo.language] ?? "rgba(240,240,240,0.3)",
                      display: "inline-block",
                      flexShrink: 0,
                    }} />
                    {repo.language}
                  </span>
                )}
              </div>

              {repo.description && (
                <p style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.8rem",
                  color: "rgba(240,240,240,0.32)",
                  lineHeight: 1.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "38rem",
                }}>
                  {repo.description}
                </p>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
              {repo.stargazers_count > 0 && (
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.75rem",
                  color: "rgba(240,240,240,0.25)",
                }}>
                  <StarRounded style={{ fontSize: 14, color: "rgba(240,240,240,0.25)" }} />
                  {repo.stargazers_count}
                </span>
              )}
              <ArrowOutwardRounded style={{ fontSize: 16, color: "rgba(240,240,240,0.18)" }} />
            </div>
          </motion.a>
        ))}

        <div style={{ borderTop: "1px solid rgba(240,240,240,0.06)" }} />
      </div>
    </div>
  );
}
