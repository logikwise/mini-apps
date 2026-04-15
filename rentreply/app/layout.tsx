import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RentReply — Formal Housing Letters Made Simple",
  description: "Generate professional, legally-minded housing letters for tenants and landlords in seconds. No account required.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='12' fill='%232C5F1A'/><text y='.9em' font-size='80' x='10'>📄</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <footer className="mt-auto bg-stone-100 border-t border-stone-200 py-6 text-center text-sm text-stone-500">
          <p>Built by <a href="https://recursionagent.net" className="text-forest hover:underline">Recursion Labs</a> · <a href="https://recursionagent.net" className="hover:text-forest">recursionagent.net</a></p>
        </footer>
      </body>
    </html>
  );
}
