/* eslint-disable react-hooks/exhaustive-deps */
import ky from 'ky';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../components/Message.js';
import Rating from '../components/Rating.js';
import { getError } from '../util.js';
import { Store } from '../Store.js';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Sidebar from '../components/Sidebar.js';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Productpage() {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  const [qty, setQty] = useState(1);
  const fetchProduct = () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      ky.get(`/api/products/${id}`)
        .then((res) => res.json())
        .then((res) => dispatch({ type: 'FETCH_SUCCESS', payload: res }));
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [id]);
  //console.log(getError(error));

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `https://kickpik-backend.vercel.app/api/products/${product._id}`
    );
    // console.log(data);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch(
      {
        type: 'CART_ADD_ITEM',
        payload: { ...product, quantity },
      },
      navigate('/cart')
    );
  };
  return (
    <div>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        </div>
      ) : (
        <div className="flex">
          <Sidebar />
          <div className="productpage-container pt-5 pb-5 pl-12 pr-12">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="productpage-image"
              />
            </div>
            <div className="productpage-details">
              <div>
                <h2 className="productpage-name">{product.name}</h2>
              </div>
              <div>
                <span className="productpage-description">
                  {product.description}
                </span>
              </div>
              <div className="productpage-rating">
                <Rating
                  rating={product.rating}
                  numReviews={product.numberOfReviews}
                />
              </div>
              <div>
                <hr />
              </div>
              {product.countInStock > 0 ? (
                <div>
                  <div className="productpage-quantity-container">
                    <div>
                      <label>
                        <select
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                          className="productpage-quantity"
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option
                              key={x + 1}
                              value={x + 1}
                              className="productpage-qty-option"
                            >
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="productpage-quantity-alert">
                      <div>
                        Only{' '}
                        <span className="quantity-color">
                          {product.countInStock} Items
                        </span>{' '}
                        Left!
                      </div>
                      <div>Don't miss it</div>
                    </div>
                  </div>
                  <div className="productpage-price">
                    <h2>
                      ${product.price} or ₹{(product.price * 82.84).toFixed(2)}
                    </h2>
                  </div>
                  <div>
                    <hr />
                  </div>
                  <div className="productpage-button">
                    <div>
                      <button className="productpage-buynow">
                        <strong>Buy Now</strong>
                      </button>
                    </div>
                    <div>
                      <button
                        className="productpage-addToCart"
                        onClick={addToCartHandler}
                      >
                        <strong>Add to Cart</strong>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <span>Out of stock!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
