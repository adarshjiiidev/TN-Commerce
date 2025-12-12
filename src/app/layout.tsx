import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import Layout from '@/components/layout/Layout';
import ErrorBoundary from '@/components/error/ErrorBoundary';

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-horizon",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Limit//Up - Redefine Your Style",
    template: "%s | Limit//Up",
  },
  description: "Discover bold, minimal designs that speak to the modern lifestyle. Premium fashion and accessories for the contemporary wardrobe. Shop T-shirts, accessories, and more.",
  keywords: [
    "Limit//Up fashion",
    "modern clothing",
    "minimal design",
    "contemporary fashion",
    "premium t-shirts",
    "fashion accessories",
    "online clothing store",
    "lifestyle brand",
    "trendy apparel",
    "quality clothing"
  ],
  authors: [{ name: "Limit//Up Fashion" }],
  creator: "Limit//Up Fashion",
  publisher: "Limit//Up Fashion",
  metadataBase: new URL("https://tnfashion.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tnfashion.vercel.app",
    title: "Limit//Up - Redefine Your Style",
    description: "Discover bold, minimal designs that speak to the modern lifestyle. Premium fashion and accessories for the contemporary wardrobe.",
    siteName: "Limit//Up Fashion",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Limit//Up Fashion - Modern Clothing Brand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Limit//Up - Redefine Your Style",
    description: "Discover bold, minimal designs that speak to the modern lifestyle.",
    creator: "@tn_fashion",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} dark`}>
      <body className="font-sans bg-[#0d0d12] text-white antialiased">
        <ErrorBoundary>
          <Layout>
            {children}
          </Layout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
