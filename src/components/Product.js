import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating.js';

export default function Product(props) {
  const { product } = props;
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
        <div>
          <button className="product-addToCart-button">
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
