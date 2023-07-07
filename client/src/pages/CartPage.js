import React, { useContext } from "react";
import { Store } from "../Store.js";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import EmptyCartErrorMessage from "../components/EmptyCartMessage.js";

export default function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(
      `https://kickpik-backend.vercel.app/api/products/${item._id}`
    );
    if (data.countInStock < quantity) {
      window.alert(`Sorry! Product is out of stock.`);
      return;
    }
    ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    console.log(data);
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <div className="cart-container">
        <div className="cart-text-container">
          <div className="shopping-cart-text font-nunito text-3xl font-semibold font-primary">
            Shopping Cart
          </div>
        </div>
        {cartItems.length === 0 ? (
          <div className="h-full">
            <h3>It feels so light here.</h3>
            <EmptyCartErrorMessage>
              Cart is empty.<Link to="/">Go Shopping</Link>{" "}
            </EmptyCartErrorMessage>
          </div>
        ) : (
          <div className="item-list-container h-screen">
            <ul className="item-list">
              {cartItems.map((item) => (
                <li key={item._id} className="item-list-li">
                  <div className="item-container">
                    <div className="cart-item-image">
                      {" "}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="small medium large cart-image"
                      />
                    </div>
                    <div className="item-container-details">
                      <div>
                        {" "}
                        <Link
                          to={`/product/id/${item._id}`}
                          className="item-list-a font-nunito font-extrabold"
                        >
                          <strong>{item.name}</strong>
                        </Link>
                      </div>
                      <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                        <span>
                          <strong className="font-nunito">${item.price}</strong>
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
                        </button>{" "}
                        <strong className="item-quantity font-nunito">
                          {item.quantity}
                        </strong>{" "}
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
              <div className="checkout-text">
                <div className="font-nunito font-bold mb-10">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                  items) : $
                  {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                </div>
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
