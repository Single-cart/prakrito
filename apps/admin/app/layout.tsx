import { Geist, Geist_Mono } from "next/font/google";

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
          <Providers>{children}</Providers>
          <Toaster position="top-center" reverseOrder={false} />
        </ReduxProvider>
      </body>
    </html>
  );
}
