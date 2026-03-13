import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers"
import { geistMono, geistSans, jetbrainsMono } from "@/utils/fonts";
import { ThemeProvider } from "@/components/reutilizable/theme-provider";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";


const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gut out",
  },
  icons: {
    apple: "/web-app-manifest-192x192.png"
  },
  title: {
    default: "Gut out | Home",
    template: "Gut out | %s"
  },
  description: "Anonymous, ephemeral, and crypto-powered chat sessions.",
  metadataBase: new URL(`${process.env.APP_URL}`),
  authors: {
    name: "Dan Chanivet",
    url: "https://danchanivet.xyz",
  },
  publisher: "Vercel",
  openGraph: {
    images: [
      {
        url: "./opengraph-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Gut out thumbnail"
      },
    ],
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>

          <Providers>
            {children}
          </Providers>

        </ThemeProvider>
      </body>
    </html>
  );
}
