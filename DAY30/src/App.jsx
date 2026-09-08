import { CartProvider } from "./CartProvider";
import Header from "./Header";
import Hero from "./Hero";
import Menu from "./Menu";
import CheckoutPanel from "./CheckoutPanel";
import Footer from "./Footer";

function App() {
  return (
    <CartProvider>
      <div className="app">
        <Header />
        <Hero />
        <main className="main-content">
          <Menu />
          <CheckoutPanel />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
