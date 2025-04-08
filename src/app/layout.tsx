import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from "@/components/session-auth";
import { Toaster } from 'sonner'
import { QueryClientContext } from "./providers/queryClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Odonto Smart",
  description: "Encontre os melhores profissionais em um único local!",
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  openGraph: {
    title: "Odonto Smart",
    description: "Encontre os melhores profissionais em um único local!",
    images: [`${process.env.NEXT_PUBLIC_URL}/doctor-hero.png`]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientContext>
          <SessionAuthProvider>
            <Toaster
              duration={2500}
            />
            {children}
          </SessionAuthProvider>
        </QueryClientContext>
      </body>
    </html>
  );
}
