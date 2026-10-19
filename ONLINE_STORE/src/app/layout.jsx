/**
 * ==============================================================================
 * ROOT LAYOUT - SHETA (ሽታ) PERFUMES
 * ==============================================================================
 * Top-level application layout:
 * - Uses next/font/google (Playfair_Display & Plus_Jakarta_Sans) with display: 'swap'.
 *   This eliminates render-blocking external font requests (fonts.googleapis.com)
 *   and satisfies CodeOps Day 43 Core Web Vitals guidelines.
 * - Imports global.css directly via ES module to eliminate render-blocking stylesheet links.
 * - Wraps all routes in ThemeRegistry (Material UI SSR cache & theme provider).
 * - Wraps routes in CartProvider (Global shopping bag state & persistence).
 * - Strict 5-color luxury palette: #121212, #C5A059, #FAF8F5, #FFFFFF, #6B7280.
 * ==============================================================================
 */

import React from "react";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import ThemeRegistry from "../theme/ThemeRegistry";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import "./global.css";

// 1. Next.js automatic font self-hosting and zero render-blocking configuration
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["500", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Sheta (ሽታ) | Artisanal & Luxury Perfumes",
  description:
    "Handcrafted luxury fragrances honouring ancient Ethiopian botanical traditions, rare highland frankincense, Semien cedarwood, and Damascene rose extraits.",
  keywords: [
    "Sheta",
    "ሽታ",
    "Ethiopian Perfumes",
    "Artisanal Fragrance",
    "Frankincense Perfume",
    "Luxury Extraits",
    "Highland Scents"
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={plusJakarta.className}>
        <ThemeRegistry>
          <CartProvider>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: "#FAF8F5"
              }}
            >
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
          </CartProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
