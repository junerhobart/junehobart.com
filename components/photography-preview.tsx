import Link from "next/link";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { PhotographyCarousel } from "./photography-carousel";

type UnsplashPhoto = {
  id: string;
  urls: { small: string };
  alt_description: string | null;
  width: number;
  height: number;
};

async function fetchPreviewPhotos(): Promise<UnsplashPhoto[]> {
  try {
    const res = await fetch(
      "https://api.unsplash.com/users/junehobart/photos?per_page=8&order_by=latest",
      {
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function PhotographyPreview() {
  const photos = await fetchPreviewPhotos();

  return (
    <section
      id="photography"
      style={{ padding: "6rem 2rem", position: "relative", zIndex: 1 }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font)",
              fontSize: 38,
              fontWeight: 500,
              color: "#fafafa",
              margin: 0,
            }}
          >
            Photography
          </h2>
          <Link
            href="/photography"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              fontFamily: "var(--font)",
              fontSize: 12,
              color: "#555",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            View all
            <ArrowForwardRounded style={{ fontSize: 13 }} />
          </Link>
        </div>

        <PhotographyCarousel photos={photos} />
      </div>
    </section>
  );
}
