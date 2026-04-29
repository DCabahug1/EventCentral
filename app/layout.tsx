import type { Metadata } from "next";
import { Afacad_Flux, Noto_Serif, DM_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/header/Header";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer/Footer";
import PageMount from "@/components/ui/page-mount";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Afacad_Flux({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eventcentral-us.vercel.app"),
  title: "EventCentral",
  description: "Discover what's happening around you.",
  icons: {
    apple: "/logo.jpeg",
  },
  openGraph: {
    title: "EventCentral",
    description: "Discover what's happening around you.",
    images: ["/logo.jpeg"],
  },
  twitter: {
    card: "summary",
    title: "EventCentral",
    description: "Discover what's happening around you.",
    images: ["/logo.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header />
          <PageMount>{children}</PageMount>
          <Footer />
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
        <Script
          src="https://tweakcn.com/live-preview.min.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
