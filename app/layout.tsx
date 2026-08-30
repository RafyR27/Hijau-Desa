import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TanStackProvider } from "@/providers/tanstack-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hijau Desa",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", plusJakartaSans.variable)}
    >
      <link rel="icon" href="/logo.svg" sizes="any" />
      <body className="min-h-full flex flex-col">
        <TanStackProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </TanStackProvider>
        <Toaster />
      </body>
    </html>
  );
}
