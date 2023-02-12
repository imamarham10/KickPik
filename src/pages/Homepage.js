import ky from 'ky';
import React, { useEffect, useState } from 'react';

import Product from '../components/Product.js';
export default function Homepage() {
  const [products, setProducts] = useState([]);
  const fetchData = () => {
    ky.get('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((res) => setProducts(res));
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <h1>Featured Product</h1>
        <div className="products">
          {products?.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
