import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrapHouseBlog - Craft Cannabis Growing & Smoking Secrets",
  description: "The ultimate underground bible for organic cannabis cultivation, master rolling techniques, solventless live rosin chemistry, and terpene profiles. Voted up by growers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
