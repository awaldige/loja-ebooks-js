
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loja de eBooks | Conhecimento a um clique",
  description:
    "Explore nossa biblioteca digital de eBooks sobre programação, tecnologia, design e marketing. Aprenda no seu ritmo.",
  keywords: [
    "ebooks",
    "livros digitais",
    "programação",
    "tecnologia",
    "marketing digital",
    "design",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}