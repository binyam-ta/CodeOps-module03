import { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Header from "./Header";
import Footer from "./Footer";

export const metadata: Metadata = {
  title: "Addis Café — Fresh Ethiopian Food & Coffee",
  description: "Authentic Ethiopian dining, Buna ceremonies, and TeleBirr delivery in Addis Ababa.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-layout">
            <Header />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
