import { Geist, Geist_Mono } from "next/font/google";

import BottomNavbar from "@/components/BottomNavbar";
import Footer from "@/components/Footer";
import GoogleTagManager from "@/components/gtm/GoogleTagManager";
import GoogleTagManagerNoScript from "@/components/gtm/GoogleTagManagerNoScript";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/providers";
import { allkeywords, descriptionShop } from "@/lib/contstens";
import { initDataLayer } from "@/lib/gtm";
import ReduxProvider from "@/providers/ReduxProvider";
import "@workspace/ui/globals.css";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Fablura",
  description: descriptionShop,
  keywords: allkeywords,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize dataLayer as early as possible
  if (typeof window !== "undefined") {
    initDataLayer();
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleTagManager />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <GoogleTagManagerNoScript />
        <ReduxProvider>
          <Providers>
            <Navbar />
            {children}
            <BottomNavbar />
            <div className={"pt-20"}>
              <Footer />
            </div>
            <Toaster />
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
