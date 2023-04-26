import React, { useContext } from 'react';
import { Store } from '../Store.js';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert(`Sorry! Product is out of stock.`);
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    console.log(data);
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <div className="cart-container">
        <div className="cart-text-container">
          <h1 className="shopping-cart-text text-3xl font-semibold font-primary">
            Shopping Cart
          </h1>
        </div>
        {cartItems.length === 0 ? (
          <div>
            <h3>It feels so light here.</h3>
            <Link to="/">Go Shopping</Link>
          </div>
        ) : (
          <div className="item-list-container">
            <ul className="item-list">
              {cartItems.map((item) => (
                <li key={item._id} className="item-list-li">
                  <div className="item-container">
                    <div>
                      {' '}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="small medium large"
                      />
                    </div>
                    <div className="item-container-details">
                      <div>
                        {' '}
                        <Link
                          to={`/product/id/${item._id}`}
                          className="item-list-a"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <div style={{ marginLeft: '20px', marginRight: '20px' }}>
                        <span>
                          <strong>${item.price}</strong>
                        </span>
                      </div>

                      <div className="item-quantity-button">
                        <button
                          disabled={item.quantity === 1}
                          className="button-minus"
                          onClick={() =>
                            updateCartHandler(item, item.quantity - 1)
                          }
                        >
                          <i className="fas fa-minus-circle"></i>
                        </button>{' '}
                        <span className="item-quantity">{item.quantity}</span>{' '}
                        <button
                          disabled={item.quantity === item.countInStock}
                          className="button-plus"
                          onClick={() =>
                            updateCartHandler(item, item.quantity + 1)
                          }
                        >
                          <i className="fas fa-plus-circle"></i>
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => removeItemHandler(item)}
                          variant="light"
                          className="button-remove"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="checkout-detail">
              <div style={{ marginTop: '-25px' }}>
                <h4>
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                  items) : $
                  {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                </h4>
              </div>
              <div>
                <button
                  disabled={cartItems.length === 0}
                  className="cartpage-checkout"
                  onClick={() => checkoutHandler()}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
