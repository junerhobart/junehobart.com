"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";

type UnsplashPhoto = {
  id: string;
  urls: { small: string };
  alt_description: string | null;
  width: number;
  height: number;
};

const GAP = 8;
const HEIGHT = 340;

export function PhotographyCarousel({ photos }: { photos: UnsplashPhoto[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  const widths = useMemo(
    () => photos.map((p) => (p.height > p.width ? 220 : 340)),
    [photos]
  );

  const stride = useMemo(
    () => widths.reduce((s, w) => s + w + GAP, 0),
    [widths]
  );

  const looped = useMemo(
    () => [...photos, ...photos, ...photos],
    [photos]
  );

  const loopedWidths = useMemo(
    () => [...widths, ...widths, ...widths],
    [widths]
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el || stride === 0) return;
    el.scrollLeft = stride;
  }, [stride]);

  const smoothScrollBy = useCallback((distance: number, duration = 700) => {
    const el = trackRef.current;
    if (!el) return;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const state = { start: el.scrollLeft, target: el.scrollLeft + distance };
    const startTime = performance.now();
    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const step = (now: number) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      el.scrollLeft = state.start + (state.target - state.start) * ease(elapsed);

      const s = el.scrollLeft;
      if (s < stride * 0.5) {
        el.scrollLeft += stride;
        state.start += stride;
        state.target += stride;
      } else if (s >= stride * 2.5) {
        el.scrollLeft -= stride;
        state.start -= stride;
        state.target -= stride;
      }

      if (elapsed < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [stride]);

  useEffect(() => {
    if (paused || photos.length <= 1) return;
    const id = setInterval(() => smoothScrollBy(loopedWidths[0] + GAP, 700), 2600);
    return () => clearInterval(id);
  }, [paused, photos.length, smoothScrollBy, loopedWidths]);

  if (photos.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: GAP,
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {looped.map((photo, i) => (
          <a
            key={`${photo.id}-${i}`}
            href="https://unsplash.com/@junehobart"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flexShrink: 0,
              width: loopedWidths[i],
              height: HEIGHT,
              borderRadius: 10,
              overflow: "hidden",
              position: "relative",
              display: "block",
            }}
          >
            <Image
              src={photo.urls.small}
              alt={photo.alt_description ?? "photo"}
              fill
              style={{ objectFit: "cover" }}
              sizes="340px"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
