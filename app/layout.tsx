import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clip Finder — AI-powered short-form clip discovery",
  description:
    "Turn long-form video transcripts into short-form clip ideas using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
