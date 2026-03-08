"use client";

import { useRef } from "react";
import { ImageTrail } from "@/components/ui/image-trail";
import Image from "next/image";

interface Props {
  photoUrls: { src: string; alt: string }[];
  children: React.ReactNode;
}

export function PhotographyTrailWrapper({ photoUrls, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Image trail layer — pointer-events none so grid stays clickable */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <ImageTrail
          containerRef={containerRef}
          interval={120}
          rotationRange={12}
          animationSequence={[
            [{ scale: 1, opacity: 1 }, { duration: 0.12, ease: "circOut" }],
            [{ scale: 0.9, opacity: 0 }, { duration: 0.55, ease: "circIn" }],
          ]}
        >
          {photoUrls.map(({ src, alt }, i) => (
            <div
              key={i}
              style={{
                width: 88,
                height: 88,
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Image
                src={src}
                alt={alt}
                width={88}
                height={88}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </ImageTrail>
      </div>

      {children}
    </div>
  );
}
