import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { twkEverett } from "./fonts"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "iOS-style Countdown Timer",
  description: "A countdown timer with iOS-style scrolling digits",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${twkEverett.variable}`}>{children}</body>
    </html>
  )
}

