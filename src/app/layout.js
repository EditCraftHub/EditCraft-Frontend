// app/layout.jsx (or similar)
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Store/Provider";
import SocketStatusManager from "./Components/SocketStatusManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EditCraft", // Default title
  description: "EditCraft is India's creative hub connecting video editors, designers, and creators with clients worldwide. Build your portfolio, find projects, and grow your career.",
  keywords: ["video editing", "freelance editors", "content creators", "EditCraft India","Free online video editor no watermark", "Video editing fiverr","AI remove background video free"], // Add more relevant keywords
  icons: {
    icon: "/logooo.png",
  },
  openGraph: {
    title: "EditCraft — Create. Connect. Grow.",
    description: "India’s creative hub for editors and creators.",
    images: ["/logo.png"], // Use absolute URLs in production (e.g., "https://editcraft.co.in/logo.png")
    url: "https://editcraft.co.in",
    type: "website",
    siteName: "EditCraft",
  },
  twitter: { // For Twitter/X cards
    card: "summary_large_image",
    title: "EditCraft — Create. Connect. Grow.",
    description: "India’s creative hub for editors and creators.",
    images: ["/logo.png"],
  },
  robots: { // Controls search engine crawling
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
  alternates: { // For canonical URLs and language alternates
    canonical: "https://editcraft.co.in",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <SocketStatusManager>
            {children}
          </SocketStatusManager>
        </Providers>
      </body>
    </html>
  );
}