import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kameravue - Your Perfect Moments, Beautifully Shared",
  description:
    "Share life's beautiful moments with stunning photo galleries. Upload, organize, and share your photos with the world. Free forever.",
  keywords: [
    "photo gallery",
    "share photos",
    "photo sharing",
    "free photo storage",
    "photo organizer",
  ],
  authors: [{ name: "Kameravue Team" }],
  openGraph: {
    title: "Kameravue - Share Beautiful Moments",
    description:
      "Your perfect moments, beautifully captured and shared with the world",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
