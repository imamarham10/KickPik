import ky from 'ky';
import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import Rating from '../components/Rating.js';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, product: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function Productpage() {
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
      ky.get(`http://localhost:5000/api/product/id/${id}`)
        .then((res) => res.json())
        .then((res) => dispatch({ type: 'FETCH_SUCCESS', payload: res }));
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: error.message });
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [id]);
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="productpage-container">
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
                    <button className="productpage-addToCart">
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
      )}
    </div>
  );
}
