import axios from 'axios';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../Store.js';
import Rating from './Rating.js';

export default function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:5000/api/products/${item._id}`
    );
    console.log(data);
    if (data.countInStock < quantity) {
      window.alert('Sorry! Product is out of stock.');
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };
  return (
    <div key={product._id} className="product">
      <div className="product-image">
        <Link to={`/product/id/${product._id}`}>
          <img src={product.image} alt={product.name} />
        </Link>
      </div>
      <div className="product-info">
        <div className="product-name-price">
          <Link to={`/product/id/${product._id}`}>
            <span className="product-name">
              <strong>{product.name}</strong>
            </span>
          </Link>
          <span>
            <strong>${product.price}</strong>
          </span>
        </div>
        <div className="product-gender">
          <span>{product.gender}</span>
        </div>
        <div>
          <Rating
            rating={product.rating}
            numReviews={product.numberOfReviews}
          />
        </div>
        {product.countInStock === 0 ? (
          <div style={{ marginTop: '10px' }}>
            <span
              style={{
                fontWeight: '750',
              }}
            >
              Out of Stock
            </span>
          </div>
        ) : (
          <div>
            <button
              className="product-addToCart-button"
              onClick={() => addToCartHandler(product)}
            >
              <span>Add to Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
