import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import ConvexClientProvider from "../providers/ConvexClientProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/themes/theme-provider";

export const metadata: Metadata = {
  title: "Chirps",
  description: "Your best chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          themes={["light", "dark"]}
        >
          <ConvexClientProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
