import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ApplyBot — ATS-Optimized Resumes That Land Interviews",
  description:
    "Paste your resume and a job listing. Get an ATS-optimized version that hits the right keywords, format, and structure. No account required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${sora.variable} font-sora antialiased bg-slate-950 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}