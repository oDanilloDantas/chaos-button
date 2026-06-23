import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { QueryParamsProvider } from "@/components/QueryParamsProvider/QueryParamsProvider";
import { Analytics, GtmNoScript } from "@/components/Analytics/Analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://caos.andremariga.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Botão do Caos",
  description: "Você não precisa de mais um curso. Você precisa da verdade.",
  openGraph: {
    title: "Botão do Caos",
    description: "Você não precisa de mais um curso. Você precisa da verdade.",
    url: siteUrl,
    siteName: "Botão do Caos",
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060708",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <GtmNoScript />
        <QueryParamsProvider>{children}</QueryParamsProvider>
        <Analytics />
      </body>
    </html>
  );
}
