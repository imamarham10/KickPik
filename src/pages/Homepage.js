import ky from 'ky';
import React, { useEffect, useReducer } from 'react';
import Loading from '../components/Loading.js';
import MessageBox from '../components/Message.js';
import Product from '../components/Product.js';
import { getError } from '../util.js';

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
  const fetchAllProducts = () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      ky.get(`http://localhost:5000/api/products`)
        .then((res) => res.json())
        .then((res) => dispatch({ type: 'FETCH_SUCCESS', payload: res }));
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
    }
  };
  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <>
      <div>
        <h1>Featured Product</h1>
        {loading ? (
          <div>
            <Loading />
          </div>
        ) : error ? (
          <div>
            <MessageBox variant="danger">{error}</MessageBox>
          </div>
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
