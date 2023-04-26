import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading.js';
import ErrorMessage from '../components/Message.js';
import TextMessage from '../components/TextMessage.js';
import { Store } from '../Store.js';
import { getError } from '../util.js';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}

export default function OrderPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      successPay: false,
      loadingPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `https://kickpik-backend.vercel.app/api/orders/${order._id}/pay`,
          details,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        window.alert(`Order is paid.`);
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        window.alert(getError(err));
      }
    });
  }

  function onError(err) {
    window.alert(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `https://kickpik-backend.vercel.app/api/orders/${orderId}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        console.log(data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
    if (successPay) {
      dispatch({ type: 'PAY_RESET' });
    } else {
      const loadPayPalScript = async () => {
        const { data: clientId } = await axios.get(
          `https://kickpik-backend.vercel.app/api/keys/paypal`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPayPalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);

  return loading ? (
    <Loading></Loading>
  ) : error ? (
    <ErrorMessage variant="danger">{error}</ErrorMessage>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <div
        style={{
          display: 'flex',
          fontFamily: 'Nunito',
          flexWrap: 'wrap',
          fontSize: 'xx-small',
          justifyContent: 'center',
        }}
      >
        <h1 style={{ fontFamily: 'Nunito' }}>Order Id: {orderId}</h1>
      </div>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2 style={{ fontFamily: 'Nunito' }}>Shipping</h2>
                <p>
                  <strong style={{ fontFamily: 'Nunito' }}>Name:</strong>{' '}
                  {order.shippingAddress.fullName} <br />
                  <strong style={{ fontFamily: 'Nunito' }}>
                    Address:{' '}
                  </strong>{' '}
                  {order.shippingAddress.address},{order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <TextMessage variant="success">
                    Delivered At {order.deliveredAt}
                  </TextMessage>
                ) : (
                  <TextMessage variant="danger">Not Delivered</TextMessage>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2 style={{ fontFamily: 'Nunito' }}>Payment</h2>
                <p>
                  <strong style={{ fontFamily: 'Nunito' }}>Method:</strong>{' '}
                  {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <TextMessage variant="success">
                    Paid at {order.paidAt}
                  </TextMessage>
                ) : (
                  <TextMessage variant="danger">Not Paid</TextMessage>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2 style={{ fontFamily: 'Nunito' }}>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          />
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          {item.quantity} x ${item.price} = $
                          {item.quantity * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2 style={{ fontFamily: 'Nunito' }}>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>${order.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>${order.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${order.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong style={{ fontFamily: 'Nunito' }}>
                      {' '}
                      Order Total
                    </strong>
                  </div>
                  <div>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              {!order.isPaid && (
                <li>
                  {isPending ? (
                    <Loading />
                  ) : (
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  )}
                  {loadingPay && <Loading></Loading>}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
