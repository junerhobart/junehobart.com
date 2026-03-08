import Link from "next/link";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import { PhotoGrid } from "@/components/photo-grid";
import { PhotographyTrailWrapper } from "@/components/photography-trail";

export const revalidate = 1800;

type UnsplashPhoto = {
  id: string;
  urls: { regular: string };
  alt_description: string | null;
  width: number;
  height: number;
  links: { html: string };
  likes: number;
};

async function fetchPhotos(): Promise<UnsplashPhoto[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.error("[photography] UNSPLASH_ACCESS_KEY is not set");
    return [];
  }
  try {
    const res = await fetch(
      "https://api.unsplash.com/users/junehobart/photos?per_page=30&order_by=latest",
      {
        headers: { Authorization: `Client-ID ${key}` },
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`[photography] Unsplash API error ${res.status}:`, body);
      return [];
    }
    return res.json();
  } catch (e) {
    console.error("[photography] fetch failed:", e);
    return [];
  }
}

export default async function Photography() {
  const photos = await fetchPhotos();

  const trailPhotos = photos.slice(0, 12).map((p) => ({
    src: p.urls.regular,
    alt: p.alt_description ?? "photo",
  }));

  return (
    <PhotographyTrailWrapper photoUrls={trailPhotos}>
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        padding: "4rem 2rem 8rem",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "5rem",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontFamily: "var(--font)",
              fontSize: 12,
              color: "#444",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <ArrowBackRounded style={{ fontSize: 13 }} />
            Back
          </Link>
          <a
            href="https://unsplash.com/@junehobart"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontFamily: "var(--font)",
              fontSize: 12,
              color: "#444",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Unsplash
            <ArrowOutwardRounded style={{ fontSize: 13 }} />
          </a>
        </div>

        <div style={{ marginBottom: "4rem" }}>
          <h1
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
              fontWeight: 500,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Photography
          </h1>
          <p
            style={{
              fontFamily: "var(--font)",
              fontSize: 13,
              color: "#333",
              margin: "1rem 0 0",
              letterSpacing: "0.04em",
            }}
          >
            {photos.length} photos
          </p>
        </div>

        <PhotoGrid photos={photos} />

      </div>
    </main>
  );
}
