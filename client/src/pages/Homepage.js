import axios from 'axios';
import ky from 'ky';
import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet';
import Loading from '../components/Loading.js';
import ErrorMessage from '../components/Message.js';
import Product from '../components/Product.js';
import { getError } from '../util.js';
import Sidebar from '../components/Sidebar.js';

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
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });
  //const [products, setProducts] = useState([]);
  const fetchAllProducts = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const { data } = await axios.get(
        `https://kickpik-backend.vercel.app/api/products`
      );
      console.log(data);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });

      // ky.get(`/api/products`)
      //   .then((res) => res.json())
      //   .then((res) => dispatch({ type: 'FETCH_SUCCESS', payload: res }));
    } catch (error) {
      console.log(error);
      dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <>
      <div>
        <Helmet>
          <title>KickPik</title>
        </Helmet>
        <h1>Featured Product</h1>
        {loading ? (
          <div>
            <Loading />
          </div>
        ) : error ? (
          <div>
            <ErrorMessage variant="danger">{error}</ErrorMessage>
          </div>
        ) : (
          <div className="flex">
            <Sidebar />
            <div className="products">
              {products?.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
