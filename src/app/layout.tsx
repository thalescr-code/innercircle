import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Inner Circle // Private 35mm Roll",
  description: "Private photo sharing and self-moderation rolls for friend groups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.variable} font-sans bg-film-black text-zinc-300 min-h-full flex flex-col antialiased selection:bg-brand-orange/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
