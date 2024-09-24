import type { Metadata } from "next";

import { ThemeProvider } from "@/components/Theme";
import { Toaster } from "@/components/ui/sonner";

import "@/shared/globals.css";

export const metadata: Metadata = {
  title: "Kefir | Login",
  description: "Sistema interno",
  verification: {
    other: {
      robots: "noindex",
      googlebot: "noindex",
    },
  },
  robots: {
    follow: false,
    index: false,
    googleBot: {
      follow: false,
      index: false,
    },
    noimageindex: true,
    nosnippet: true,
    noarchive: true,
    nositelinkssearchbox: true,
    notranslate: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
