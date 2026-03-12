import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { PhotographyCarousel } from "./photography-carousel";

type UnsplashPhoto = {
  id: string;
  urls: { small: string };
  alt_description: string | null;
  width: number;
  height: number;
};

const isDev = process.env.NODE_ENV !== "production";

async function fetchPreviewPhotos(): Promise<UnsplashPhoto[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    if (isDev) console.error("[photography-preview] UNSPLASH_ACCESS_KEY is not set");
    return [];
  }
  try {
    const res = await fetch(
      "https://api.unsplash.com/users/junehobart/photos?per_page=8&order_by=latest",
      {
        headers: {
          Authorization: `Client-ID ${key}`,
          "Accept-Version": "v1",
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) {
      if (isDev) console.error("[photography-preview] Unsplash API error:", res.status, res.statusText);
      return [];
    }
    return res.json();
  } catch (err) {
    if (isDev) console.error("[photography-preview] Unsplash fetch error:", err);
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
          <a
            href="https://unsplash.com/@junehobart"
            target="_blank"
            rel="noopener noreferrer"
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
          </a>
        </div>

        <PhotographyCarousel photos={photos} />
      </div>
    </section>
  );
}
