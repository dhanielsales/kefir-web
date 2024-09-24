import type { Metadata } from "next";

import "@/shared/globals.css";

export const metadata: Metadata = {
  title: "Kefir",
  description: "Sistema interno",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
