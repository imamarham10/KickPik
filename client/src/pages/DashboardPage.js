import React, { useContext, useEffect, useReducer } from "react";
import { Store } from "../Store.js";
import { getError } from "../util.js";
import axios from "axios";
import Loading from "../components/Loading";
import ErrorMessage from "../components/Message";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, summary: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardPage() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(userInfo.token);
        const { data } = await axios.get('https://kickpik-backend.vercel.app/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div>
      <h1 className="font-bold font-nunito text-4xl">Dashboard</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage variant="danger">{error}</ErrorMessage>
      ) : (
        <>
          <div className="flex">
            <div className="flex-col">
              <div>
                {summary.users && summary.users[0]
                  ? summary.users[0].numUsers
                  : 0}
              </div>
              <div>Users</div>
            </div>
            <div className="flex-col">
              <div>
                {summary.orders && summary.users[0]
                  ? summary.orders[0].numOrders
                  : 0}
              </div>
              <div>Orders</div>
            </div>
            <div className="flex-col">
              <div>
                $
                {summary.orders && summary.users[0]
                  ? summary.orders[0].totalSales.toFixed(2)
                  : 0}
              </div>
              <div>Orders</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
