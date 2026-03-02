import Image from "next/image";
import Link from "next/link";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";

export const revalidate = 3600;

type UnsplashPhoto = {
  id: string;
  urls: { regular: string; small: string; full: string };
  alt_description: string | null;
  description: string | null;
  width: number;
  height: number;
  links: { html: string };
  likes: number;
};

async function fetchPhotos(): Promise<UnsplashPhoto[]> {
  try {
    const res = await fetch(
      "https://api.unsplash.com/users/junehobart/photos?per_page=30&order_by=latest",
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

export default async function Photography() {
  const photos = await fetchPhotos();

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        padding: "4rem 2rem 6rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "var(--font)",
              fontSize: 13,
              color: "#555",
              textDecoration: "none",
            }}
          >
            <ArrowBackRounded style={{ fontSize: 15 }} />
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
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Unsplash
            <ArrowOutwardRounded style={{ fontSize: 13 }} />
          </a>
        </div>

        <h1
          style={{
            fontFamily: "var(--font)",
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 600,
            color: "#fafafa",
            margin: "0 0 0.5rem",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Photography
        </h1>
        <p style={{ fontFamily: "var(--font)", fontSize: 14, color: "#444", margin: "0 0 3.5rem" }}>
          Madeira, Portugal &amp; beyond.
        </p>

        {photos.length === 0 ? (
          <p style={{ fontFamily: "var(--font)", fontSize: 14, color: "#444" }}>No photos found.</p>
        ) : (
          <div
            style={{
              columns: "3 280px",
              gap: 12,
            }}
          >
            {photos.map((photo) => (
              <a
                key={photo.id}
                href={photo.links.html}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  marginBottom: 12,
                  borderRadius: 8,
                  overflow: "hidden",
                  breakInside: "avoid",
                  position: "relative",
                }}
              >
                <Image
                  src={photo.urls.regular}
                  alt={photo.alt_description ?? "photo"}
                  width={photo.width}
                  height={photo.height}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
              </a>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
