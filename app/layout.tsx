import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Design Studio Inventory Hub",
  description: "Manage your design studio inventory and requests",
  icons: {
    icon: [
      {
        url: "/icon-small.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-small.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <QueryProvider>
        {children}
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
