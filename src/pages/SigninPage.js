import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import Loading from '../components/Loading.js';
import ErrorMessage from '../components/Message.js';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { search } = useLocation();
  const redirectURL = new URLSearchParams(search).get('redirect');
  const redirect = redirectURL ? redirectURL : '/';

  return (
    <div>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      {/* {loading ? (
        <div>
          <Loading />
        </div>
      ) : error ? (
        <div>
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        </div>
      ) : ( */}
      <form className="form">
        <div>
          <h1 className="brand-link">Sign In</h1>
        </div>
        <div>
          <label htmlFor="Email Address" style={{ fontWeight: 600 }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            required
            style={{ fontWeight: 600, borderRadius: '10px', padding: '5px' }}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="Password" style={{ fontWeight: 600 }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            required
            style={{ fontWeight: 600, borderRadius: '10px', padding: '5px' }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label />
          <button className="cartpage-checkout" type="submit">
            Sign In
          </button>
        </div>
        <div>
          <label />
          <div>
            New customer?{' '}
            <Link
              to={`/register?redirect=${redirect}`}
              style={{ color: '#092e20', fontWeight: '600' }}
            >
              Create your account
            </Link>
          </div>
        </div>
      </form>
      {/* )} */}
    </div>
  );
}
