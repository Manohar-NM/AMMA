import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dear Amma | A Mother's Day Surprise",
  description: "A cinematic Mother's Day love letter from a son to his Amma.",
  metadataBase: new URL("https://dear-amma.vercel.app"),
  openGraph: {
    title: "Dear Amma",
    description: "A cinematic Mother's Day surprise made with love.",
    images: ["/memories/amma-beach.jpeg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dear Amma",
    description: "A cinematic Mother's Day surprise made with love.",
    images: ["/memories/amma-beach.jpeg"]
  }
};

export const viewport: Viewport = {
  themeColor: "#05030a",
  colorScheme: "dark"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
