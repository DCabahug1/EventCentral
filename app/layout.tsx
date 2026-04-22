import type { Metadata } from "next";
import { Afacad_Flux, Noto_Serif, DM_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer/Footer";
import PageMount from "@/components/ui/page-mount";

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
  title: "EventCentral",
  description: "Discover what's happening around you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>

      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header />
          <PageMount>{children}</PageMount>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
