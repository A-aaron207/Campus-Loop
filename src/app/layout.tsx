import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusLoop | Hypersonic Student Marketplace",
  description: "Buy, sell, and trade within your campus community.",
};

// CampusLoop Layout - V1
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full bg-background text-foreground antialiased selection:bg-primary/30`}
      >
        <div className="flex min-h-screen">
          <Navigation />
          <main className="flex-1 lg:pl-64 pb-20 lg:pb-0">
            <div className="max-w-7xl mx-auto p-4 lg:p-8">
              {children}
            </div>
          </main>
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: 'glass text-white border-white/10',
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
