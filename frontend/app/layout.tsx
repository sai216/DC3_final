import type { Metadata } from "next";
import React from "react";
import ClientBoundary from "./ClientBoundary";
import "@/assets/css/globals.css";

export const metadata: Metadata = {
  title: "Decensat DC3",
  description: "Decensat DC3 Design - Advanced Portfolio Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ClientBoundary>
          {children}
        </ClientBoundary>
      </body>
    </html>
  );
}
