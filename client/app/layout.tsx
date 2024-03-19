import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/common/header";
import { AuthProvider } from "./context/auth";
import { Toaster } from "./components/ui/sonner";

const inter = IBM_Plex_Mono({
  weight: ["100", "200", "400", "500", "600", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
