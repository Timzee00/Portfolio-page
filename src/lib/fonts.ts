import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";

// Display face: character-driven, not the Inter/Space-Grotesk default
// pairing — chosen for the "creative developer" duality concept.
export const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const fontBody = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Used for code-flavored details: the role-typing line, tech badges,
// the "coded" half of the split hero title.
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
