import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Rating from '../components/Rating.js';
import data from '../Data.js';
export default function Homepage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/products');
      console.log(result.data);
      setProducts(result.data);
    };
    fetchData();
  }, []);
  return (
    <>
      <div>
        <h1>Featured Product</h1>
        <div className="products">
          {data.products.map((product) => (
            <div key={product._id} className="product">
              <div className="product-image">
                <Link to={`/product/${product.name}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
              </div>
              <div className="product-info">
                <div className="product-name-price">
                  <Link to={`/product/${product.name}`}>
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
          ))}
        </div>
      </div>
    </>
  );
}
