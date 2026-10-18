/**
 * ==============================================================================
 * ROOT LAYOUT - SHETA (ሽታ) PERFUMES
 * ==============================================================================
 * Top-level application layout:
 * - Wraps all routes in ThemeRegistry (Material UI SSR cache & theme provider).
 * - Wraps routes in CartProvider (Global shopping bag state & persistence).
 * - Implements persistent Navbar and Footer.
 * - Adheres strictly to the 5-color luxury palette:
 *   #121212 (Obsidian), #C5A059 (Gold), #FAF8F5 (Alabaster), #FFFFFF (White), #6B7280 (Slate).
 * ==============================================================================
 */

import React from "react";
import ThemeRegistry from "../theme/ThemeRegistry";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box } from "@mui/material";

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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          /* Strict 5-color global scrollbars & selections */
          body {
            margin: 0;
            padding: 0;
            background-color: #FAF8F5;
            color: #121212;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          ::selection {
            background-color: #C5A059;
            color: #121212;
          }
          h1, h2, h3, .font-serif {
            font-family: 'Playfair Display', Georgia, serif;
          }
        `}</style>
      </head>
      <body>
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
