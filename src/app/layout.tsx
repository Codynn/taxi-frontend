import type { Metadata, Viewport } from "next";
import {
  Sora,
  Poppins,
  Inter,
  Montserrat,
  Luckiest_Guy,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/shared/Footer";
import Providers from "@/providers/react-query-provider";
import AuthInitProvider from "@/providers/AuthInitProviders";
import { AuthModalProvider } from "@/context/Authmodalcontext";
import AuthModal from "@/components/auth/authModal";
import { Toaster } from "sonner";
import Script from "next/script";
import FCMProvider from "@/providers/FCMProvider";

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

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const luckiestGuy = Luckiest_Guy({
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
  weight: ["400"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FEA800",
  // On iOS Safari, the on-screen keyboard by default just overlays the page
  // without resizing the viewport, which is why a bottom sheet (position:
  // fixed against the *layout* viewport) ends up shifted/hidden behind the
  // keyboard when a field inside it is focused. "resizes-content" makes the
  // viewport actually shrink like it already does on Android, so fixed
  // elements stay correctly positioned above the keyboard.
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: {
    default: "Lokpriya Taxi | Popular Ride ",
    template: "%s | Popular Ride",
  },

  description:
    "Book the right car for every journey across Nepal. Popular Ride by Lokpriya Taxi Pvt. Ltd. offers reliable vehicles, seamless booking, and comfortable travel — anytime you need it.",

  keywords: [
    "Popular Ride",
    "Lokpriya Taxi",
    "car rental Nepal",
    "taxi Nepal",
    "book a ride Nepal",
    "cab booking Nepal",
    "long trip Nepal",
    "vehicle rental Dang",
    "taxi Tulsipur",
    "taxi Kathmandu",
    "ride booking Nepal",
    "Nepal taxi service",
    "airport pickup Nepal",
    "outstation cab Nepal",
  ],

  authors: [{ name: "Lokpriya Taxi Pvt. Ltd." }],
  creator: "Lokpriya Taxi Pvt. Ltd.",
  publisher: "Lokpriya Taxi Pvt. Ltd.",

  metadataBase: new URL("https://www.lokpriyataxi.com.np"),

  alternates: {
    canonical: "https://www.lokpriyataxi.com.np",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Popular Ride | Lokpriya Taxi",
    description:
      "Book reliable cars, auto rickshaws, and bikes across Nepal. Seamless booking experience with Popular Ride by Lokpriya Taxi.",
    url: "https://www.lokpriyataxi.com.np",
    siteName: "Popular Ride",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Popular Ride — Book the Right Car for Every Journey",
      },
    ],
    locale: "en_NP",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Popular Ride | Lokpriya Taxi",
    description:
      "Reliable taxi and vehicle booking across Nepal. Cars, auto rickshaws, and bikes — anytime you need.",
    images: ["/logo/logo-full.png.svg"],
  },

  icons: {
    icon: "/logo/logo-full.svg",
    apple: "/logo/logo-full.svg",
  },

  other: {
    "geo.region": "NP-P5",
    "geo.placename": "Dang, Nepal",
    "geo.position": "28.0069;82.4737",
    ICBM: "28.0069, 82.4737",
    "application-name": "Lokpriya Rides",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Lokpriya Rides",
    "mobile-web-app-capable": "yes",
    "theme-color": "#FEA800",
    "msapplication-TileColor": "#FEA800",
    "msapplication-tap-highlight": "no",
  },

  manifest: "/manifest.json",
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
        montserrat.variable,
        inter.variable,
        luckiestGuy.variable,
      )}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <AuthInitProvider>
            <AuthModalProvider>
              <FCMProvider>
                <main className="pb-16 lg:pb-0">{children}</main>
                <Footer />
                <Toaster
                  position="top-right"
                  richColors
                  toastOptions={{
                    style: { zIndex: 99999 },
                  }}
                />
                <AuthModal />
              </FCMProvider>
            </AuthModalProvider>
          </AuthInitProvider>
        </Providers>
      </body>

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-Q6P94HKHFN"
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-Q6P94HKHFN');
        `}
      </Script>
    </html>
  );
}
