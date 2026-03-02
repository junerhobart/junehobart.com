import { ContributionsGrid } from "./contributions-grid";

type Contribution = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

async function fetchContributions(): Promise<{
  contributions: Contribution[];
  total: number;
}> {
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
    return { contributions: data.contributions, total };
  } catch {
    return { contributions: [], total: 0 };
  }
}

export async function Contributions() {
  const { contributions, total } = await fetchContributions();
  return <ContributionsGrid contributions={contributions} total={total} />;
}
