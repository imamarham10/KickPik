import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store.js';

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || 'PayPal'
  );
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeOrder');
  };
  return (
    <div className="paymentmethod-container">
      <Helmet>
        <title>Payment Method</title>
      </Helmet>{' '}
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1
            className="text-3xl font-semibold"
            style={{ fontFamily: 'Nunito', textAlign: 'center' }}
          >
            Payment Method
          </h1>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              id="paypal"
              value="PayPal"
              name="paymentMethod"
              required
              checked
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
            <label htmlFor="paypal" className="ml-5 font-medium text-lgclear">
              PayPal
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              id="paytm"
              value="Paytm"
              name="paymentMethod"
              required
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
            <label htmlFor="Paytm">Paytm</label>
          </div>
        </div>
        <div>
          <button className="cartpage-checkout" type="submit">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
