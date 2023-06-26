import logo from "./resources/sneakers.png";
import cartIcon from "./resources/shopping-cart.png";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage.js";
import Productpage from "./pages/Productpage.js";
import Socials from "./components/Socials.js";
import { useContext } from "react";
import { Store } from "./Store.js";
import CartPage from "./pages/CartPage.js";
import SigninPage from "./pages/SigninPage.js";
import ShippingAddresspage from "./pages/ShippingAddresspage.js";
import SignupPage from "./pages/SignupPage.js";
import PaymentMethodPage from "./pages/PaymentMethodPage.js";
import PlaceOrderPage from "./pages/PlaceOrderPage.js";
import OrderPage from "./pages/OrderPage.js";
import OrderHistoryPage from "./pages/OrderHistoryPage.js";
import ProfilePage from "./pages/ProfilePage.js";
import SearchBox from "./components/SearchBox.js";
import SearchPage from "./pages/SearchPage.js";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardPage from "./pages/DashboardPage.js";
import ProductListScreen from "./pages/ProductListPage";
import ProductEditPage from "./pages/ProductEditPage.js";
import OrderListScreen from "./pages/OrderListPage.js";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({
      type: "USER_SIGNOUT",
    });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  return (
    <>
      <BrowserRouter>
        <div>
          <header className="header-container">
            <div className="socials">
              <div className="footer-socials">
                {/* <Button
                  variant="dark"
                  onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                >
                  <i className="fas fa-bars"></i>
                </Button> */}
                <Socials />
              </div>
            </div>
            <div className="header">
              <div className="logo">
                <span>
                  <Link to="/">
                    <img
                      src={logo}
                      alt="logo"
                      className="brand-icon max-sm:w-12"
                    />
                  </Link>
                </span>
                <span className="brand-link">
                  <Link to="/">
                    <span className="brand-name max-sm:text-xl">KickPik</span>
                  </Link>
                </span>
                <SearchBox />
              </div>

              <div className="header-right max-sm:flex-col-reverse max-md:flex-col-reverse">
                <Link to="/cart">
                  <div className="cart">
                    <div className="cart-icon max-sm:w-5">
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
                    <Link to="#" className="name-signin max-sm:text-sm">
                      {userInfo.name} <i className="fa fa-caret-down" />
                    </Link>
                    <ul className="dropdown-content max-sm:text-sm">
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
                {userInfo && userInfo.isAdmin && (
                  <div className="dropdown">
                    <Link to="#admin" className="name-signin max-sm:text-sm">
                      Admin <i className="fa fa-caret-down" />
                    </Link>
                    <ul className="dropdown-content">
                      <li>
                        <Link to="/admin/dashboard">Dashboard</Link>
                      </li>
                      <li>
                        <Link to="/admin/products">Products</Link>
                      </li>
                      <li>
                        <Link to="/admin/orders">Orders</Link>
                      </li>
                      <li>
                        <Link to="/admin/userlist">Users</Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </header>
          {/* <div
            className={
              sidebarIsOpen
                ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
                : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
            }
          > */}
          {/* <Nav className="flex-column text-white w-100 p-2">
              <Nav.Item>
                <strong>Categories</strong>
              </Nav.Item>
               {categories.map((category) => (
              <Nav.Item key={category}>
                <Link
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </Link>
              </Nav.Item>
            ))} 
            </Nav> */}
          {/* </div> */}
          <main>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/product/id/:id" element={<Productpage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/:signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/shipping" element={<ShippingAddresspage />} />
              <Route path="/payment" element={<PaymentMethodPage />} />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
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
