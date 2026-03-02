"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type UnsplashPhoto = {
  id: string;
  urls: { regular: string };
  alt_description: string | null;
  width: number;
  height: number;
  links: { html: string };
  likes: number;
};

export function PhotoGrid({ photos }: { photos: UnsplashPhoto[] }) {
  if (photos.length === 0) {
    return (
      <p style={{ fontFamily: "var(--font)", fontSize: 14, color: "#333" }}>
        No photos yet.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 8,
      }}
    >
      {photos.map((photo, i) => (
        <motion.a
          key={photo.id}
          href={photo.links.html}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
          whileHover="hovered"
          style={{
            display: "block",
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
          }}
        >
          <Image
            src={photo.urls.regular}
            alt={photo.alt_description ?? "photo"}
            width={photo.width}
            height={photo.height}
            style={{ width: "100%", height: "auto", display: "block" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <motion.div
            variants={{
              hovered: { opacity: 1 },
            }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "flex-end",
              padding: "1rem",
            }}
          >
            {photo.likes > 0 && (
              <span
                style={{
                  fontFamily: "var(--font)",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.04em",
                }}
              >
                ♥ {photo.likes}
              </span>
            )}
          </motion.div>
        </motion.a>
      ))}
    </div>
  );
}
