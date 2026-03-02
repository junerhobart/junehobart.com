"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
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
};

const ACCENT = "#275180";

const CARD_WIDTH = 370;
const CARD_GAP = 16;
const STRIDE_REPS = 3;
const THUMB_W = 18;

function titleCase(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function ProjectsGrid({ repos }: { repos: Repo[] }) {
  const featured = repos.filter((r) => !r.fork);

  const trackRef   = useRef<HTMLDivElement>(null);
  const thumbRef   = useRef<HTMLDivElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const dragRef    = useRef<{ active: boolean; startX: number; startScroll: number }>({
    active: false, startX: 0, startScroll: 0,
  });
  const rafRef     = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  const looped = useMemo(
    () => Array.from({ length: STRIDE_REPS }, () => featured).flat(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [featured.length]
  );

  const stride = featured.length * (CARD_WIDTH + CARD_GAP);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || stride === 0) return;
    el.scrollLeft = stride;
  }, [stride]);

  const updateThumb = useCallback(() => {
    const el = trackRef.current;
    const thumb = thumbRef.current;
    if (!el || !thumb || stride === 0) return;

    if (el.scrollLeft < stride * 0.5)       el.scrollLeft += stride;
    else if (el.scrollLeft >= stride * 2.5) el.scrollLeft -= stride;

    const local = ((el.scrollLeft - stride) % stride + stride) % stride;
    thumb.style.left = `${(local / stride) * (100 - THUMB_W)}%`;
  }, [stride]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateThumb, { passive: true });
    return () => el.removeEventListener("scroll", updateThumb);
  }, [updateThumb]);

  const smoothScrollBy = useCallback((distance: number, duration = 700) => {
    const el = trackRef.current;
    if (!el) return;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const start = el.scrollLeft;
    const target = start + distance;
    const startTime = performance.now();
    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const step = (now: number) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      el.scrollLeft = start + (target - start) * ease(elapsed);
      if (elapsed < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (paused || featured.length <= 1) return;
    const id = setInterval(() => {
      smoothScrollBy(CARD_WIDTH + CARD_GAP, 650);
    }, 2800);
    return () => clearInterval(id);
  }, [paused, featured.length, smoothScrollBy]);

  const onThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    dragRef.current = { active: true, startX: e.clientX, startScroll: trackRef.current?.scrollLeft ?? 0 };
    setPaused(true);

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current.active) return;
      const bar = barRef.current;
      const el  = trackRef.current;
      if (!bar || !el) return;
      const barW   = bar.clientWidth;
      const thumbW = barW * (THUMB_W / 100);
      const travel = barW - thumbW;
      const delta  = ev.clientX - dragRef.current.startX;
      const scrollDelta = (delta / travel) * stride;
      el.scrollLeft = dragRef.current.startScroll + scrollDelta;
    };

    const onUp = () => {
      dragRef.current.active = false;
      setPaused(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [stride]);

  if (featured.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: CARD_GAP,
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          backgroundColor: "var(--bg)",
          paddingBottom: 2,
        }}
      >
        {looped.map((repo, i) => {
          return (
            <a
              key={`${repo.name}-${i}`}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flexShrink: 0,
                width: CARD_WIDTH,
                height: 400,
                borderRadius: 16,
                padding: "2rem",
                paddingTop: "calc(2rem + 3px)",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                backgroundColor: `${ACCENT}0d`,
                boxShadow: `inset 0 3px 0 0 ${ACCENT}`,
              }}
            >

              {/* Language */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {repo.language && (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontFamily: "var(--font)",
                    fontSize: "0.68rem",
                    color: "#555",
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      backgroundColor: LANG_COLORS[repo.language] ?? "#555",
                      display: "inline-block",
                    }} />
                    {repo.language}
                  </span>
                )}
              </div>

              {/* Name + description */}
              <div>
                <h3 style={{
                  fontFamily: "var(--font)",
                  fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
                  fontWeight: 600,
                  color: "#fafafa",
                  margin: "0 0 0.9rem",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                }}>
                  {titleCase(repo.name)}
                </h3>
                {repo.description && (
                  <p style={{
                    fontFamily: "var(--font)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "#555",
                    margin: 0,
                    maxWidth: "85%",
                  }}>
                    {repo.description}
                  </p>
                )}
              </div>

              {/* Bottom */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {repo.stargazers_count > 0 ? (
                  <span style={{
                    display: "flex", alignItems: "center", gap: "0.3rem",
                    fontFamily: "var(--font)", fontSize: "0.72rem", color: "#444",
                  }}>
                  <StarRounded style={{ fontSize: 13 }} />
                  {repo.stargazers_count}
                </span>
                ) : <span />}
                <ArrowOutwardRounded style={{ fontSize: 16, color: "#555" }} />
              </div>
            </a>
          );
        })}
      </div>

      {/* Draggable scrollbar */}
      <div
        ref={barRef}
        style={{
          marginTop: "1.5rem",
          height: 5,
          backgroundColor: "rgba(255,255,255,0.06)",
          borderRadius: 999,
          position: "relative",
        }}
      >
        <div
          ref={thumbRef}
          onMouseDown={onThumbMouseDown}
          style={{
            position: "absolute",
            top: 0,
            left: "0%",
            height: "100%",
            width: `${THUMB_W}%`,
            backgroundColor: "#275180",
            borderRadius: 999,
            cursor: "grab",
            transition: "left 80ms linear",
            userSelect: "none",
          }}
        />
      </div>
    </div>
  );
}
