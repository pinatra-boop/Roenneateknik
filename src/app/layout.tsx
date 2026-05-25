import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import CookieBanner from "@/components/CookieBanner";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RÃ¸nne Autoteknik â€“ Professionelt AutovÃ¦rksted",
    template: "%s | RÃ¸nne Autoteknik",
  },
  description:
    "RÃ¸nne Autoteknik tilbyder professionel service, reparation og klargÃ¸ring af alle bilmÃ¦rker. Book tid online eller ring til os i dag.",
  keywords: [
    "autovÃ¦rksted",
    "RÃ¸nne",
    "Bornholm",
    "bilservice",
    "bremseskift",
    "syn",
    "dÃ¦k",
    "mekaniker",
    "klargÃ¸ring",
    "oliekift",
  ],
  authors: [{ name: "RÃ¸nne Autoteknik" }],
  creator: "RÃ¸nne Autoteknik",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "da_DK",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "RÃ¸nne Autoteknik",
    title: "RÃ¸nne Autoteknik â€“ Professionelt AutovÃ¦rksted",
    description:
      "Professionel bilservice og reparation pÃ¥ Bornholm. Book tid online.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RÃ¸nne Autoteknik",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RÃ¸nne Autoteknik",
    description: "Professionelt autovÃ¦rksted pÃ¥ Bornholm",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="da"
      className={`${inter.variable} ${outfit.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-surface text-text antialiased"
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <CookieBanner />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#112240",
                color: "#e8edf5",
                border: "1px solid #1e3a5f",
              },
              success: {
                iconTheme: { primary: "#e8931a", secondary: "#0a1929" },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
