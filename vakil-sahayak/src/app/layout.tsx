import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VakilSahayak",
  description: "Workflow system for advocates. Case tracking, document management, and daily updates on WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
