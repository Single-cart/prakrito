import { Metadata } from "next";
import React from "react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Special Offer | Limited Time Deal",
  description: "Exclusive limited time offers on premium products",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-bengali">
        {children}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 5000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              style: {
                background: "green",
                color: "#fff",
              },
            },
            error: {
              duration: 3000,
              style: {
                background: "red",
                color: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
