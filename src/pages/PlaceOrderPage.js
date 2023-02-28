import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store.js';

export default function PlaceOrderPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {};
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);
  return (
    <div>
      {' '}
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2 style={{ fontFamily: 'Nunito' }}>Shipping</h2>
                <p>
                  <strong style={{ fontFamily: 'Nunito' }}>Name:</strong>{' '}
                  {cart.shippingAddress.fullName} <br />
                  <strong style={{ fontFamily: 'Nunito' }}>
                    Address:{' '}
                  </strong>{' '}
                  {cart.shippingAddress.address},{cart.shippingAddress.city},{' '}
                  {cart.shippingAddress.postalCode},
                  {cart.shippingAddress.country}
                </p>
                <Link to={'/shipping'} style={{ textDecoration: 'underline' }}>
                  Edit
                </Link>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2 style={{ fontFamily: 'Nunito' }}>Payment</h2>
                <p>
                  <strong style={{ fontFamily: 'Nunito' }}>Method:</strong>{' '}
                  {cart.paymentMethod}
                </p>
                <Link
                  to={'/paymentmethod'}
                  style={{ textDecoration: 'underline' }}
                >
                  Change
                </Link>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2 style={{ fontFamily: 'Nunito' }}>Order Items</h2>
                <ul>
                  {cart.cartItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          />
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          <strong style={{ fontFamily: 'Nunito' }}>
                            {item.quantity} x ${item.price} = $
                            {item.quantity * item.price}
                          </strong>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link to={'/cart'} style={{ textDecoration: 'underline' }}>
                  Edit
                </Link>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2 style={{ fontFamily: 'Nunito' }}>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>${cart.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>${cart.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${cart.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong style={{ fontFamily: 'Nunito' }}>
                      {' '}
                      Order Total
                    </strong>
                  </div>
                  <div>
                    <strong>${cart.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              <li>
                <button
                  type="button"
                  onClick={placeOrderHandler}
                  className="primary block cartpage-checkout"
                  disabled={cart.cartItems.length === 0}
                >
                  Place Order
                </button>
              </li>
              {/* {loading && <Loading />} */}
              {/* {error && <ErrorMessage variant="danger">{error}</ErrorMessage>} */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
