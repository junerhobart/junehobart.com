import Image from "next/image";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { fetchMediumPosts, formatDate, type MediumPost } from "@/lib/medium";

const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME ?? "junehobart";

export async function BlogPreview() {
  const posts = await fetchMediumPosts(MEDIUM_USERNAME);

  return (
    <section
      id="blog"
      style={{ padding: "6rem 2rem", position: "relative", zIndex: 1 }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", width: "100%" }}>
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
            Blog
          </h2>
          <a
            href={`https://medium.com/@${MEDIUM_USERNAME}`}
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

        {posts.length === 0 ? (
          <p style={{ fontFamily: "var(--font)", fontSize: 14, color: "#666", margin: 0 }}>
            No posts yet.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {posts.map((post) => (
              <BlogCard key={post.link} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: MediumPost }) {
  const dateStr = formatDate(post.pubDate);
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="blog-card"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition: "opacity 0.2s",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 10",
          backgroundColor: "var(--surface)",
        }}
      >
        {post.image ? (
          <Image
            src={post.image}
            alt=""
            fill
            sizes="(max-width: 840px) 100vw, 380px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "rgba(255,255,255,0.04)",
            }}
          />
        )}
      </div>
      <div style={{ padding: "1.25rem 1.25rem 1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3
          style={{
            fontFamily: "var(--font)",
            fontSize: 17,
            fontWeight: 600,
            color: "#fafafa",
            margin: "0 0 0.35rem",
            lineHeight: 1.4,
          }}
        >
          {post.title}
        </h3>
        {dateStr ? (
          <p
            style={{
              fontFamily: "var(--font)",
              fontSize: 11,
              color: "#666",
              margin: "0 0 0.5rem",
              letterSpacing: "0.02em",
            }}
          >
            {dateStr}
          </p>
        ) : null}
        {post.description ? (
          <p
            style={{
              fontFamily: "var(--font)",
              fontSize: 14,
              color: "#999",
              lineHeight: 1.5,
              margin: "0 0 1rem",
              flex: 1,
            }}
          >
            {post.description}
          </p>
        ) : null}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontFamily: "var(--font)",
            fontSize: 12,
            color: "#999",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Read more
          <ArrowForwardRounded style={{ fontSize: 14 }} />
        </span>
      </div>
    </a>
  );
}
