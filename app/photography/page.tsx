import { fetchPhotographyPhotos } from "@/lib/photography";
import { PhotographyClient } from "./photography-client";

export const revalidate = 1800;

export const metadata = {
  title: "Photography | June Hobart",
  description: "Shot on iPhone. Everyday frames, light, motion, and detail.",
};

export default async function PhotographyPage() {
  const photos = await fetchPhotographyPhotos();

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <PhotographyClient photos={photos} />
    </main>
  );
}
