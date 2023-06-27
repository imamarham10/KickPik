import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorMessage from "../components/Message";
import { Store } from "../Store";
import { getError } from "../util.js";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    default:
      return state;
  }
};

export default function UserEditPage() {
  const [{ loading, error, loadingUpdate, errorUpdate }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/users/${userId}`,
        { _id: userId, name, email, isAdmin },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      window.alert("User updated successfully");
      navigate("/admin/users");
    } catch (error) {
      window.alert(getError(error));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <div className="h-screen">
      <form className="form-user-edit" onSubmit={submitHandler}>
        <div className="mx-20">
          <div className="font-nunito font-bold text-lg">
            Edit User {userId}
          </div>
        </div>
        {loadingUpdate && <Loading />}
        {errorUpdate && (
          <ErrorMessage variant="danger">{errorUpdate}</ErrorMessage>
        )}
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        ) : (
          <>
            <div className="flex flex-col mx-20 my-2">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col mx-20 my-2">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-row items-center mx-20 my-2">
              <label htmlFor="isAdmin">Is Admin</label>
              <input
                id="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="mx-20 p-10"
              />
            </div>
            <div className="mx-20 items-center">
              <button className="primary cartpage-checkout my-10" type="submit">
                Update
              </button>
              {/* {userInfo.email === "admin@kickpik.com" ? (
                <button
                  className="primary cartpage-checkout my-10"
                  type="submit" disabled
                >
                  Update
                </button>
              ) : (
                <button
                  className="primary cartpage-checkout my-10"
                  type="submit"
                >
                  Update
                </button>
              )} */}
            </div>
          </>
        )}
      </form>
    </div>
  );
}
