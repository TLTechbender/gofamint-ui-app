import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import ReactQueryProviders from "@/components/reactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white">
        <ReactQueryProviders>
          <div className="min-h-screen flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-50">
              <Navbar />
            </div>
            <main className="flex-1 overflow-y-auto pt-16">{children}</main>
            <Footer />
          </div>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
