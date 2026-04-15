import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ThanksMaker — Elegant Thank You Notes for Every Occasion",
  description:
    "Transform gift details and giver names into beautifully crafted thank-you notes. Perfect for weddings, showers, anniversaries, and life's special moments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cormorant.variable}>{children}</body>
    </html>
  );
}
