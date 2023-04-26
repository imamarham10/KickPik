import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading.js';
import ErrorMessage from '../components/Message.js';
import { Store } from '../Store.js';
import { getError } from '../util.js';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ tpye: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          'https://kickpik-backend.vercel.app/api/orders/mine',
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!userInfo) {
      navigate('/');
    }
    fetchData();
  }, [userInfo, navigate]);
  return (
    <div>
      <div>
        <Helmet>
          <title>Order History</title>
        </Helmet>

        <h1 className="order-history">Order History</h1>
        {loading ? (
          <Loading></Loading>
        ) : error ? (
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th className="collapsable">TOTAL</th>
                <th className="collapsable">PAID</th>
                <th className="collapsable">DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td className="collapsable">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="collapsable">
                    {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                  </td>
                  <td className="collapsable">
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : 'No'}
                  </td>
                  <td>
                    <button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
