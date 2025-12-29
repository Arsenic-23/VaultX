import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VaultX - Upload. Share. Earn.",
  description:
    "Monetized file hosting platform. Upload files, share links, and earn from downloads.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#050509] text-white antialiased`}>
        <TooltipProvider delayDuration={150}>
          <NavbarWrapper />
          <main className="min-h-screen">{children}</main>
          <FooterWrapper />
        </TooltipProvider>
      </body>
    </html>
  );
}
