import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { getError } from "../util.js";
import Loading from "../components/Loading";
import ErrorMessage from "../components/Message";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`https://kickpik-backend.vercel.app/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);
  const deleteHandler = async (order) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`https://kickpik-backend.vercel.app/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        window.alert("order deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        window.alert(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  return (
    <div className="p-5">
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <div className="font-bold font-nunito text-2xl">Orders</div>
      {loadingDelete && (
        <div className="h-screen">
          <Loading></Loading>
        </div>
      )}
      {loading ? (
        <div className="h-screen">
          <Loading></Loading>
        </div>
      ) : error ? (
        <ErrorMessage variant="danger">{error}</ErrorMessage>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th className="collapsable">ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th className="collapsable">PAID</th>
              <th className="collapsable">DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="collapsable">{order._id}</td>
                <td>{order.user ? order.user.name : "DELETED USER"}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                {/* <td className="collapsable">{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td> */}
                <td className="collapsable">
                  {order.isPaid ? order.paidAt.substring(0, 10) : "No"}
                </td>
                <td className="collapsable">
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : "No"}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                  &nbsp;
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(order)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
