import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Cursor } from "@/components/cursor";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  let description =
    "Frontend · open source · game development. Madeira, Portugal. Open to collaborations.";
  try {
    const res = await fetch("https://api.github.com/users/junerhobart", {
      next: { revalidate: 86400 },
    });
    const user = await res.json();
    if (user.bio) description = user.bio;
  } catch {}

  return {
    title: "June Hobart",
    description,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}<Cursor /></body>
    </html>
  );
}
