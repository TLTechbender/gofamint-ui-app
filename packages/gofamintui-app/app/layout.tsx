import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Montserrat, Syne } from "next/font/google";
import ReactQueryProviders from "@/components/reactQueryProvider";
import ReactToastifyProvider from "@/components/reactToastifyProvider";
import { LogoOnly } from "@/sanity/interfaces/footerContent";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { logoQuery } from "@/sanity/queries/footerContent";
import { Metadata } from "next";
import { GoogleMapProvider } from "@/providers/google-map-provider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),
};

async function getSiteSettings(): Promise<LogoOnly | null> {
  try {
    return await sanityFetchWrapper(logoQuery);
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return null;
  }
}

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site settings on the server
  const logoData = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased bg-white">
        <ReactQueryProviders>
          <ReactToastifyProvider>
            <GoogleMapProvider
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            >
              <div className="min-h-screen flex flex-col">
                <div className="fixed top-0 left-0 right-0 z-50">
                  <Navbar
                    logo={logoData?.logo}
                    siteName={logoData?.logo?.fellowshipName || "Fellowship"}
                  />
                </div>
                <main className="flex-1 overflow-y-auto pt-16">{children}</main>
                <Footer />
              </div>
            </GoogleMapProvider>
          </ReactToastifyProvider>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
