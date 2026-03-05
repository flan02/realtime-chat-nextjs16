import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers"
import { geistMono, geistSans, jetbrainsMono } from "@/utils/fonts";



export const metadata: Metadata = {
  title: "Self-destructing chat app",
  description: "Created by Nextjs 16, Redis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
