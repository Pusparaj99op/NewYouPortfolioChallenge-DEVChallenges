import localFont from "next/font/local"

// Load TWK Everett font
export const twkEverett = localFont({
  src: [
    {
      path: "../public/fonts/TWKEverett-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/TWKEverett-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-twk-everett",
  display: "swap",
})

