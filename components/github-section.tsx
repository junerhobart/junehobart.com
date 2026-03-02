import { ContributionsGrid } from "./contributions-grid";
import { ProjectsList } from "./projects-list";

type Contribution = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  updated_at: string;
  fork: boolean;
};

async function fetchContributions() {
  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/junerhobart?y=last",
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    const total = Object.values(data.total as Record<string, number>).reduce(
      (a, b) => a + b,
      0
    );
    return { contributions: data.contributions as Contribution[], total };
  } catch {
    return { contributions: [] as Contribution[], total: 0 };
  }
}

async function fetchRepos(): Promise<Repo[]> {
  try {
    const all: Repo[] = [];
    let page = 1;
    while (true) {
      const res = await fetch(
        `https://api.github.com/users/junerhobart/repos?sort=pushed&per_page=100&page=${page}`,
        { next: { revalidate: 300 } }
      );
      const batch: Repo[] = await res.json();
      if (!Array.isArray(batch) || batch.length === 0) break;
      all.push(...batch);
      if (batch.length < 100) break;
      page++;
    }
    return all;
  } catch {
    return [];
  }
}

export async function GithubSection() {
  const [{ contributions, total }, repos] = await Promise.all([
    fetchContributions(),
    fetchRepos(),
  ]);

  return (
    <section
      id="projects"
      style={{
        padding: "6rem 2rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", width: "100%" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3.5rem" }}>
          <h2 style={{ fontFamily: "var(--font)", fontSize: 38, fontWeight: 500, color: "#fafafa", margin: 0 }}>
            Projects
          </h2>
          <div style={{ width: 56, height: 0, borderTop: "2px solid rgba(153,153,153,0.5)" }} />
        </div>

        <ProjectsList repos={repos} />

        <div
          style={{
            marginTop: "5rem",
            paddingTop: "3rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <ContributionsGrid contributions={contributions} total={total} compact />
        </div>

      </div>
    </section>
  );
}
