import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import Loading from "../components/Loading";
import ErrorMessage from "../components/Message";
import { getError } from "../util.js";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loadingCreate: false,
      };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/admin?page=${page} `,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {}
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createHandler = async () => {
    if (window.confirm("Are you sure to create?")) {
      try {
        dispatch({ type: "CREATE_REQUEST" });
        const { data } = await axios.post(
          "/api/products",
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        window.alert("product created successfully");
        dispatch({ type: "CREATE_SUCCESS" });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        window.alert(getError(error));
        dispatch({
          type: "CREATE_FAIL",
        });
      }
    }
  };
  const deleteHandler = async (product) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/products/${product._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        window.alert("product deleted successfully");
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
    <div className="p-5 h-screen">
      <div className="flex justify-between mb-5">
        <div className="flex-col">
          <div className="font-bold text-xl font-nunito">Products</div>
        </div>
        <div className="flex-col">
          <button
            className="p-2 mb-2 bg-primary text-white rounded-full"
            onClick={createHandler}
          >
            Create Product
          </button>
        </div>
      </div>
      {loadingCreate && <Loading></Loading>}
      {loadingDelete && <Loading></Loading>}
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <ErrorMessage variant="danger">{error}</ErrorMessage>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th className="collapsable">ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th className="collapsable">CATEGORY</th>
                <th className="collapsable">BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="collapsable">{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td className="collapsable">{product.category}</td>
                  <td className="collapsable">{product.brand}</td>
                  <td>
                    <button
                      variant="light"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                      className="p-1 rounded-full"
                    >
                      Edit
                    </button>
                    &nbsp;
                    <button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex  pl-10 py-2 mt-12 mb-12 items-center mx-10 border">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={
                  x + 1 === Number(page) ? "btn text-bold mx-6" : "btn"
                }
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
