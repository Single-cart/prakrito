import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/providers";
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
  description: "Fablura is a platform for buying and selling products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <ReduxProvider>
          <Providers>
            <Navbar />
            {children}
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
