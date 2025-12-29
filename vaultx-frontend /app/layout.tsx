import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { headers } from "next/headers";

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
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#050509] text-white antialiased`}
      >
        <TooltipProvider delayDuration={150}>
          {!isDashboard && <Navbar />}

          <main className="min-h-screen">{children}</main>

          {!isDashboard && <Footer />}
        </TooltipProvider>
      </body>
    </html>
  );
}
