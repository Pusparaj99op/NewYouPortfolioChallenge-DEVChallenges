import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk, Sora, Fira_Code } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { SoundProvider } from "@/components/context/SoundContext";

import ScrollProgress from "@/components/ui/ScrollProgress";
import Preloader from "@/components/ui/Preloader";
import SmoothScrolling from "@/components/ui/SmoothScrolling";
import AppEffects from "@/components/ui/AppEffects";

import PageAnimatePresence from "@/components/ui/PageAnimatePresence";

// Dynamic import for PageTransition (needs Suspense for useSearchParams)
const PageTransition = dynamic(() => import("@/components/ui/PageTransition"));

// Lazy load heavy UI components - Moved to AppEffects.tsx

// Premium display font for headings - geometric and modern
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Clean, elegant sans-serif for body text
const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

// Premium monospace with ligatures for code and numbers
const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Pranay Gajbhiye | BlackObsidian AMC - Quantitative Trading & Web Development",
  description: "Portfolio of Pranay Gajbhiye, Founder of BlackObsidian AMC. Specializing in quantitative trading, order flow analytics, systematic strategies, and web development.",
  keywords: ["Pranay Gajbhiye", "BlackObsidian AMC", "Quantitative Trading", "Order Flow", "Web Developer", "Portfolio"],
  authors: [{ name: "Pranay Gajbhiye" }],
  creator: "Pranay Gajbhiye",
  openGraph: {
    title: "Pranay Gajbhiye | BlackObsidian AMC",
    description: "Founder & Quantitative Trader at BlackObsidian AMC. Systematic trading, order flow analytics, and web development.",
    url: "https://pranaygajbhiye.me",
    siteName: "Pranay Gajbhiye Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranay Gajbhiye | BlackObsidian AMC",
    description: "Founder & Quantitative Trader at BlackObsidian AMC",
    creator: "@_pranaygajbhiye",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0A0E27" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${sora.variable} ${firaCode.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SoundProvider>
            <ToastProvider>
              <AppEffects />
              <ScrollProgress />
              <Preloader />
              <Suspense fallback={null}>
                <PageTransition />
              </Suspense>
              {/* Skip to main content for accessibility */}
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              <SmoothScrolling>
                <PageAnimatePresence>
                  {children}
                </PageAnimatePresence>
              </SmoothScrolling>
            </ToastProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
