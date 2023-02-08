import logo from './resources/sneakers.png';
import cartIcon from './resources/shopping-cart.png';
import data from './Data';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Productpage from './pages/Productpage';
function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <header className="header">
            <div className="logo">
              <span className="brand-icon">
                <Link to="/">
                  <img src={logo} alt="logo" />
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
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/product/:name" element={<Productpage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
