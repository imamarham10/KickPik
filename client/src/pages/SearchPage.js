import React, { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getError } from "../util.js";
import axios from "axios";
import { Helmet } from "react-helmet";
import Rating from "../components/Rating.js";
import Loading from "../components/Loading.js";
import Message from "../components/Message.js";
import Product from "../components/Product.js";

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
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },

  {
    name: "$51 to $200",
    value: "51-200",
  },

  {
    name: "$201 to $500",
    value: "201-500",
  },
];

export const ratings = [
  {
    name: "4stars to up",
    rating: 4,
  },
  {
    name: "3stars to up",
    rating: 3,
  },
  {
    name: "2stars to up",
    rating: 2,
  },
  {
    name: "1stars to up",
    rating: 1,
  },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: data,
        });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await fetch(`/api/products/categories`)
          .then((response) => response.json())
          .then((response) => {
            setCategories(response);
          });
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;

    return {
      pathname: "/search",
      search: `?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}`,
    };
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <div className="flex">
        <div className="flex-col ml-2 items-center my-5">
          <h2 className="font-bold font-nunito">Categories</h2>
          <div>
            <ul>
              <li>
                <Link
                  className={"all" === category ? "text-bold" : ""}
                  to={getFilterUrl({ category: "all" })}
                >
                  Any
                </Link>
              </li>
              {categories.map((x) => (
                <li key={x}>
                  <Link
                    className={x === category ? "text-bold" : ""}
                    to={getFilterUrl({ category: x })}
                  >
                    {x}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="my-5">
            <h3 className="font-bold font-nunito">Price</h3>
            <ul>
              <li>
                <Link
                  className={"all" === price ? "text-bold" : ""}
                  to={getFilterUrl({ price: "all" })}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={ p.value === price ? "text-bold text-sm" : "text-sm"}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="my-5">
            <h3 className="font-bold font-nunito">Ratings</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? "text-bold" : ""}
                  >
                    <Rating caption={" & up"} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: "all" })}
                  className={rating === "all" ? "text-bold" : ""}
                >
                  <Rating caption={" & up"} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-col">
          {loading ? (
            <Loading></Loading>
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <div className="flex justify-around max-sm:flex-col-reverse max-sm:items-center">
                <div className="flex-col">
                  <div>
                    {countProducts === 0 ? "No" : countProducts} Results
                    {query !== "all" && " : " + query}
                    {category !== "all" && " : " + category}
                    {price !== "all" && " : Price " + price}
                    {rating !== "all" && " : Rating " + rating + " & up"}
                    {query !== "all" ||
                    category !== "all" ||
                    rating !== "all" ||
                    price !== "all" ? (
                      <button
                        variant="light"
                        onClick={() => navigate("/search")}
                      >
                        <i className="fas fa-times-circle"></i>
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="flex-col">
                  Sort by :{" "}
                  <select
                    className="cursor-pointer"
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </div>
              </div>

              {products.length === 0 && <Message>No Product Found</Message>}

              <div className="flex flex-wrap mx-1 justify-center">
                {products.map((product) => (
                  <div className="flex-col mx-5" key={product._id}>
                    <Product product={product}></Product>
                  </div>
                ))}
              </div>

              <div className="item-center border p-1">
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <button
                      className={Number(page) === x + 1 ? "text-bold" : ""}
                      variant="light"
                    >
                      {x + 1}
                    </button>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
