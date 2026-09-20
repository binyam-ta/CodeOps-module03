import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <h3 className="footer-title">ADDIS CAFÉ</h3>
            <p className="footer-tagline">Fresh Ethiopian Food &amp; Buna Ceremony</p>
            <p className="footer-bio">
              Celebrating Ethiopian culinary heritage with freshly roasted organic coffee,
              traditional slow-simmered wats, and warm hospitality in the heart of Bole.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/menu?category=Drink">Buna &amp; Drinks</Link></li>
              <li><Link to="/cart">Order Bag</Link></li>
              <li><Link to="/checkout">TeleBirr Checkout</Link></li>
            </ul>
          </div>

          {/* Hours & Location */}
          <div className="footer-col">
            <h4 className="footer-heading">Visit &amp; Contact</h4>
            <p className="footer-text">
              📍 Bole Road, across from Edna Mall<br />
              Addis Ababa, Ethiopia
            </p>
            <p className="footer-text">
              🕒 Open Daily: 7:00 AM – 10:30 PM<br />
              📞 TeleBirr Delivery: +251 911 223 344
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">&copy; {new Date().getFullYear()} Addis Café. Handcrafted with pride in Addis Ababa.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
