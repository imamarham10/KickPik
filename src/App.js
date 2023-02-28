import logo from './resources/sneakers.png';
import cartIcon from './resources/shopping-cart.png';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage.js';
import Productpage from './pages/Productpage.js';
import Socials from './components/Socials.js';
import { useContext } from 'react';
import { Store } from './Store.js';
import CartPage from './pages/CartPage.js';
import SigninPage from './pages/SigninPage.js';
import ShippingAddresspage from './pages/ShippingAddresspage.js';
import SignupPage from './pages/SignupPage.js';
import PaymentMethodPage from './pages/PaymentMethodPage.js';
import PlaceOrderPage from './pages/PlaceOrderPage.js';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({
      type: 'USER_SIGNOUT',
    });
    localStorage.removeItem('userInfo');
  };
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
              <div className="header-right">
                <Link to="/cart">
                  <div className="cart">
                    <div className="cart-icon">
                      <img src={cartIcon} alt="cart" />
                    </div>
                    {/* <div className="cart-text">Cart</div> */}
                    {cart.cartItems.length > 0 && (
                      <div className="cart-cartItems">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </div>
                    )}
                  </div>
                </Link>
                {userInfo ? (
                  <div className="dropdown">
                    <Link to="#" className="name-signin">
                      {userInfo.name} <i className="fa fa-caret-down" />
                    </Link>
                    <ul className="dropdown-content">
                      <li>
                        <Link to="/orderhistory">Order History</Link>
                      </li>
                      <li>
                        <Link to="/profile">User Profile</Link>
                      </li>
                      <li>
                        <Link to="#signout" onClick={signoutHandler}>
                          Sign Out
                        </Link>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link to="/signin" className="name-signin">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/product/id/:id" element={<Productpage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/:signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/shipping" element={<ShippingAddresspage />} />
              <Route path="/payment" element={<PaymentMethodPage />} />
              <Route path="placeorder" element={<PlaceOrderPage />} />
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
