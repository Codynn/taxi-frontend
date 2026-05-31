import type { Metadata } from "next";
import { Sora, Poppins, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Popular Rides | Book the Right Car for Every Journey",
  description:
    "Plan your trip effortlessly with Popular Rides. Select your pickup location, destination, travel date, and preferred vehicle. Book reliable cars across Nepal.",
  keywords: [
    "car rental Nepal",
    "book a ride Nepal",
    "taxi Kathmandu",
    "long trip Nepal",
    "Popular Rides",
    "ride booking",
  ],
  authors: [{ name: "Popular Rides" }],
  creator: "Popular Rides",
  metadataBase: new URL("https://popularrides.com.np"),
  openGraph: {
    title: "Popular Rides | Book the Right Car for Every Journey",
    description:
      "Discover available cars instantly and start your journey with confidence across Nepal.",
    url: "https://popularrides.com.np",
    siteName: "Popular Rides",
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Popular Rides | Book the Right Car for Every Journey",
    description:
      "Book reliable cars across Nepal. Kathmandu, Pokhara, Chitwan and more.",
  },
  icons: {
    icon: "/logo/taxi.svg",
    apple: "/logo/taxi.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        sora.variable,
        poppins.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
