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
        <link rel="stylesheet" href="/global.css" />
        <style></style>
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
