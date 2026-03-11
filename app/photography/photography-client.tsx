"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import { CircularGallery } from "@/components/circular-gallery";
import type { GalleryPhoto } from "@/lib/photography";

const SCROLL_RANGE_VH = 500;
/** More = slower: scroll this many viewport heights for one full lap of the gallery. */
const SCROLL_SENSITIVITY = 2;

export function PhotographyClient({ photos }: { photos: GalleryPhoto[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  const getScrollProgress = useCallback(() => scrollProgressRef.current, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, clientHeight } = el;
    const lapHeight = clientHeight * SCROLL_SENSITIVITY;
    if (lapHeight <= 0) return;
    scrollProgressRef.current = (scrollTop / lapHeight) % 1;
  }, []);

  if (photos.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="font-[var(--font)] text-sm text-[#666]">No photos to display yet.</p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={scrollRef}
        className="h-screen w-full overflow-y-auto overflow-x-hidden scroll-smooth"
        onScroll={handleScroll}
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div style={{ height: `${SCROLL_RANGE_VH}vh` }} aria-hidden />
      </div>

      <div className="pointer-events-none fixed inset-0 flex flex-col">
        <header className="pointer-events-auto flex items-center justify-between px-5 pt-8 sm:px-8 sm:pt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-[var(--font)] text-[11px] sm:text-xs text-[#666] no-underline tracking-[0.08em] uppercase hover:text-[#999] transition-colors"
          >
            <ArrowBackRounded style={{ fontSize: 14 }} />
            Back
          </Link>
          <a
            href="https://unsplash.com/@junehobart"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-[var(--font)] text-[11px] sm:text-xs text-[#666] no-underline tracking-[0.08em] uppercase hover:text-[#999] transition-colors"
          >
            Unsplash
            <ArrowOutwardRounded style={{ fontSize: 14 }} />
          </a>
        </header>

        <section className="pointer-events-none flex flex-1 flex-col px-5 sm:px-8">
          <div className="mb-6 sm:mb-8 text-center">
            <h1
              className="font-[var(--font)] font-medium text-[var(--text)] tracking-[-0.03em] leading-[1.05] m-0"
              style={{ fontSize: "clamp(2.5rem, 8vw, 4.25rem)" }}
            >
              Photography
            </h1>
            <p
              className="font-[var(--font)] text-sm sm:text-base text-[#888] mt-4 tracking-[0.02em] max-w-md mx-auto"
              style={{ letterSpacing: "0.02em" }}
            >
              I am an amateur photographer and full-time student trying to share my photos.
            </p>
          </div>

          <div
            className="min-h-0 flex-1 overflow-hidden rounded-xl"
            style={{ minHeight: "min(50vh, 380px)" }}
          >
            <CircularGallery
              photos={photos}
              getScrollProgress={getScrollProgress}
              sceneVerticalOffset={-1.35}
              className="h-full w-full"
            />
          </div>
        </section>
      </div>
    </>
  );
}
