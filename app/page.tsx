import { Hero } from "@/components/hero";
import { Skills } from "@/components/skills";
import { GithubSection } from "@/components/github-section";
import { PhotographyPreview } from "@/components/photography-preview";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <main style={{ position: "relative", zIndex: 1 }}>
      <Hero />
      <Skills />
      <GithubSection />
      <PhotographyPreview />
      <Contact />
    </main>
  );
}
