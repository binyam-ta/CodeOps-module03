import "./globals.css";
import Providers from "@/components/Providers.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";

export const metadata = {
  title: "Addis Eats — Fresh Ethiopian Food & Coffee",
  description:
    "Authentic Ethiopian dining, traditional Buna ceremonies, and TeleBirr delivery in Addis Ababa.",
};

export default function RootLayout({ children }) {
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
