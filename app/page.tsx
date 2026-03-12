import { Hero } from "@/components/hero";
import { GithubSection } from "@/components/github-section";
import { PhotographyPreview } from "@/components/photography-preview";
import { BlogPreview } from "@/components/blog-preview";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <main style={{ position: "relative", zIndex: 1 }}>
      <Hero />
      <GithubSection />
      <PhotographyPreview />
      <BlogPreview />
      <Contact />
    </main>
  );
}
