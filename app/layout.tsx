// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "API Visualization App— GROUP 4",
  description:
    "Rick & Morty API visualization built with Next.js, MUI, and TanStack Query. TEAM #4.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
