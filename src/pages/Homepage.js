import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Product from '../components/Product.js';
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
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
