import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store.js';

import 'react-toastify/dist/ReactToastify.css';
import { getError } from '../util.js';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { search } = useLocation();
  const redirectURL = new URLSearchParams(search).get('redirect');
  const redirect = redirectURL ? redirectURL : '/';
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [catchError, setCatchError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'https://kickpik-backend.vercel.app/api/users/signin',
        {
          email,
          password,
        }
      );
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
      console.log(data);
    } catch (err) {
      console.log(err);
      setCatchError(getError(err));
      //   window.alert(getError(err));
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="mb-12 signin-container">
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
      <form className="form" onSubmit={submitHandler}>
        <div
          style={{
            fontWeight: '500',
            color: 'red',
            padding: '10px',
          }}
        >
          {catchError}
        </div>
        <div>
          <h1
            className="text-3xl font-semibold"
            style={{ fontFamily: 'Nunito', textAlign: 'center' }}
          >
            Sign In
          </h1>
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
              to={`/signup?redirect=${redirect}`}
              style={{ color: '#092e20', fontWeight: '700' }}
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
