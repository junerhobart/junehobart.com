import Image from "next/image";
import Link from "next/link";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";

export const revalidate = 3600;

type UnsplashPhoto = {
  id: string;
  urls: { regular: string; small: string };
  alt_description: string | null;
  width: number;
  height: number;
};

async function fetchPreviewPhotos(): Promise<UnsplashPhoto[]> {
  try {
    const res = await fetch(
      "https://api.unsplash.com/users/junehobart/photos?per_page=6&order_by=latest",
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
  if (photos.length === 0) return null;

  return (
    <section
      id="photography"
      style={{
        padding: "6rem 2rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
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
              gap: "0.3rem",
              fontFamily: "var(--font)",
              fontSize: 12,
              color: "#444",
              textDecoration: "none",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "color 150ms",
            }}
          >
            View all
            <ArrowOutwardRounded style={{ fontSize: 13 }} />
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {photos.map((photo) => (
            <Link
              key={photo.id}
              href="/photography"
              style={{
                display: "block",
                borderRadius: 8,
                overflow: "hidden",
                aspectRatio: "2 / 3",
                position: "relative",
              }}
            >
              <Image
                src={photo.urls.small}
                alt={photo.alt_description ?? "photo"}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 900px) 33vw, 260px"
              />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
