import type { Metadata } from "next";
import { Work_Sans, Pacifico } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Sylvère & Bazilia - Mariage 2025",
  description: "Gestion des invités - 29 Novembre 2025 à la Salle Elim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${workSans.variable} ${pacifico.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
