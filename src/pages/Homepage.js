import ky from 'ky';
import React, { useEffect, useReducer, useState } from 'react';
import logger from 'use-reducer-logger';
import Product from '../components/Product.js';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FECTH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};
export default function Homepage() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
  //const [products, setProducts] = useState([]);
  const fetchData = () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      ky.get('http://localhost:5000/api/products')
        .then((res) => res.json())
        .then((res) => dispatch({ type: 'FETCH_SUCCESS', payload: res }));
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: error.message });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <h1>Featured Product</h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="products">
            {products?.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
