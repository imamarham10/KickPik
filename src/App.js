import logo from './resources/sneakers.png';
import cartIcon from './resources/shopping-cart.png';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage.js';
import Productpage from './pages/Productpage.js';
import Socials from './components/Socials.js';

function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <header className="header-container">
            <div className="socials">
              <div className="footer-socials">
                <Socials />
              </div>
            </div>
            <div className="header">
              <div className="logo">
                <span>
                  <Link to="/">
                    <img src={logo} alt="logo" className="brand-icon" />
                  </Link>
                </span>
                <span className="brand-link">
                  <Link to="/">
                    <span className="brand-name">KickPik</span>
                  </Link>
                </span>
              </div>
              <Link to="/cart">
                <div className="cart">
                  <div className="cart-icon">
                    <img src={cartIcon} alt="cart" />
                  </div>
                  <div className="cart-text">Cart</div>
                </div>
              </Link>
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/product/id/:id" element={<Productpage />} />
            </Routes>
          </main>
          <footer className="footer">
            <div className="footer-text">All Rights Reseved</div>
          </footer>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
