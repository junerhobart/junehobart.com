import Parser from "rss-parser";

export type MediumPost = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  image: string | null;
};

const parser = new Parser({
  customFields: {
    item: [["content:encoded", "contentEncoded"]],
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirstImageUrl(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

function formatDate(isoOrRfc: string): string {
  const d = new Date(isoOrRfc);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const isDev = process.env.NODE_ENV !== "production";

export async function fetchMediumPosts(username: string, limit = 10): Promise<MediumPost[]> {
  const feedUrl = `https://medium.com/feed/@${username.replace(/^@/, "")}`;
  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } });
    if (!res.ok) {
      if (isDev) console.error("[blog] Medium feed fetch failed:", res.status, res.statusText);
      return [];
    }
    const xml = await res.text();
    const feed = await parser.parseString(xml);
    const items = feed.items ?? [];
    const posts = items.slice(0, limit).map((item) => {
      const content =
        (item as { contentEncoded?: string }).contentEncoded ?? item.content ?? item.contentSnippet ?? "";
      const plain = stripHtml(content);
      const description = plain.length > 160 ? `${plain.slice(0, 160).trim()}…` : plain;
      const image = extractFirstImageUrl(content);
      return {
        title: item.title ?? "",
        link: item.link ?? "",
        pubDate: item.pubDate ?? "",
        description,
        image: image ?? null,
      };
    });
    return posts.filter((p) => p.link);
  } catch (err) {
    if (isDev) console.error("[blog] Medium feed error:", err);
    return [];
  }
}

export { formatDate };
