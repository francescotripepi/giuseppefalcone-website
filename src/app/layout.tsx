import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://giuseppefalcone.com"),
  title: {
    default: "Giuseppe Falcone | Master of 70s/80s/90s Classics",
    template: "%s | Giuseppe Falcone",
  },
  description:
    "Giuseppe Falcone - The best DJ mixing 70s, 80s, and 90s classics. Book now for your event.",
  keywords: [
    "DJ",
    "Giuseppe Falcone",
    "70s music",
    "80s music",
    "90s music",
    "disco",
    "dance music",
    "club DJ",
    "wedding DJ",
    "event DJ",
  ],
  authors: [{ name: "Giuseppe Falcone" }],
  creator: "Giuseppe Falcone",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Giuseppe Falcone",
    title: "Giuseppe Falcone | Master of 70s/80s/90s Classics",
    description:
      "The best DJ mixing 70s, 80s, and 90s classics. Book now for your event.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Giuseppe Falcone DJ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giuseppe Falcone | Master of 70s/80s/90s Classics",
    description:
      "The best DJ mixing 70s, 80s, and 90s classics. Book now for your event.",
    images: ["/og-image.jpg"],
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
