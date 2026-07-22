import type { Metadata } from "next";
import { fontDisplay, fontBody, fontMono } from "@/lib/fonts";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { CommandPalette } from "@/components/layout/CommandPalette";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "TIMZEE — Creative Developer & Designer",
    template: "%s · TIMZEE",
  },
  description:
    "Portfolio of TIMZEE — creative developer, graphics designer, and creative technologist.",
  openGraph: {
    title: "TIMZEE — Creative Developer & Designer",
    description:
      "Portfolio of TIMZEE — creative developer, graphics designer, and creative technologist.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "TIMZEE",
              jobTitle: "Creative Developer & Graphics Designer",
              url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
            }),
          }}
        />
        <Providers>
          <CustomCursor />
          <CommandPalette />
          <Navbar />
          <main id="top">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
