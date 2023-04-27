import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { StoreProvider } from './Store.js';
import reportWebVitals from './reportWebVitals.js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import 'tw-elements';

const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
root.render(
  <StoreProvider>
    <PayPalScriptProvider deferLoading={true}>
      <App />
    </PayPalScriptProvider>
  </StoreProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
