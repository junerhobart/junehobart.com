import { Background } from "@/components/background";
import { Hero } from "@/components/hero";
import { Skills } from "@/components/skills";
import { GithubSection } from "@/components/github-section";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <Background />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <Skills />
        <GithubSection />
        <Contact />
      </main>
    </>
  );
}
