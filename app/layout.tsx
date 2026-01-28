import type { Metadata } from "next";
import { Space_Grotesk, Sora, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import GlassCursor from "@/components/ui/GlassCursor";

import ScrollProgress from "@/components/ui/ScrollProgress";
import Preloader from "@/components/ui/Preloader";
import FluidBackground from "@/components/ui/FluidBackground";
import SmoothScrolling from "@/components/ui/SmoothScrolling";

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
    creator: "@pranaygajbhiye7",
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
          <ToastProvider>
            <GlassCursor />
            <ScrollProgress />
            {/* <FluidBackground /> */}
            <Preloader />
            {/* Skip to main content for accessibility */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <SmoothScrolling>
              {children}
            </SmoothScrolling>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
