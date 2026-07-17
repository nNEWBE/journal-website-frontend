import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Lora,
  Noto_Sans_Bengali,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoBangla = Noto_Sans_Bengali({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gono Bishwabidyalay Journal Portal",
  description:
    "A peer-reviewed interdisciplinary journal portal for Gono Bishwabidyalay featuring manuscript discovery, author guidelines, peer review, and editorial management.",
  icons: {
    icon: "/gb-logo-official.png",
    shortcut: "/gb-logo-official.png",
    apple: "/gb-logo-official.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${lora.variable} ${notoBangla.variable} ${jetBrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" richColors closeButton theme="light" />
      </body>
    </html>
  );
}
