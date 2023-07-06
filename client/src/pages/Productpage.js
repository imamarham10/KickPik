/* eslint-disable react-hooks/exhaustive-deps */
import ky from "ky";
import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../components/Message.js";
import Rating from "../components/Rating.js";
import { getError } from "../util.js";
import { Link } from "react-router-dom";
import { Store } from "../Store.js";
import axios from "axios";
import { Helmet } from "react-helmet";
import Sidebar from "../components/Sidebar.js";
import Loading from "../components/Loading.js";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import TextMessage from "../components/TextMessage.js";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Productpage() {
  let reviewsRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: "",
    });
  const [qty, setQty] = useState(1);
  const fetchProduct = () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      ky.get(`https://kickpik-backend.vercel.app/api/products/${id}`)
        .then((res) => res.json())
        .then((res) => dispatch({ type: "FETCH_SUCCESS", payload: res }));
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [id]);
  //console.log(getError(error));

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`https://kickpik-backend.vercel.app/api/products/${product._id}`);
    // console.log(data);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch(
      {
        type: "CART_ADD_ITEM",
        payload: { ...product, quantity },
      },
      navigate("/cart")
    );
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      window.alert("Please enter comment and rating");
      return;
    }
    try {
      const { data } = await axios.post(
        `https://kickpik-backend.vercel.app/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: "CREATE_SUCCESS",
      });
      window.alert("Review submitted successfully");
      product.reviews.unshift(data.review);
      product.numberOfReviews = data.numberOfReviews;
      product.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: product });
      window.scrollTo({
        behavior: "smooth",
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      window.alert(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
  };
  return (
    <div>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      {loading ? (
        <div className="h-screen">
          <Loading />
        </div>
      ) : error ? (
        <div>
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        </div>
      ) : (
        <div className="flex">
          <Sidebar />
          <div className="flex-col pt-5 pb-5 pl-12 pr-12">
            <div className="flex">
              <div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="productpage-image"
                />
              </div>
              <div className="productpage-details">
                <div>
                  <h2 className="productpage-name">{product.name}</h2>
                </div>
                <div>
                  <span className="productpage-description">
                    {product.description}
                  </span>
                </div>
                <div className="productpage-rating">
                  <Rating
                    rating={product.rating}
                    numReviews={product.numberOfReviews}
                  />
                </div>
                <div>
                  <hr />
                </div>
                {product.countInStock > 0 ? (
                  <div>
                    <div className="productpage-quantity-container">
                      <div>
                        <label>
                          <select
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            className="productpage-quantity"
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option
                                  key={x + 1}
                                  value={x + 1}
                                  className="productpage-qty-option"
                                >
                                  {x + 1}
                                </option>
                              )
                            )}
                          </select>
                        </label>
                      </div>
                      <div className="productpage-quantity-alert">
                        <div>
                          Only{" "}
                          <span className="quantity-color">
                            {product.countInStock} Items
                          </span>{" "}
                          Left!
                        </div>
                        <div>Don't miss it</div>
                      </div>
                    </div>
                    <div className="productpage-price">
                      <h2>
                        ${product.price} or ₹
                        {(product.price * 82.84).toFixed(2)}
                      </h2>
                    </div>
                    <div>
                      <hr />
                    </div>
                    <div className="productpage-button">
                      <div>
                        <button className="productpage-buynow">
                          <strong>Buy Now</strong>
                        </button>
                      </div>
                      <div>
                        <button
                          className="productpage-addToCart"
                          onClick={addToCartHandler}
                        >
                          <strong>Add to Cart</strong>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span>Out of stock!</span>
                  </div>
                )}
              </div>
            </div>
            <div className="my-10">
              <div className="font-nunito font-bold text-xl" ref={reviewsRef}>
                Reviews
              </div>
              {/* <div className="mb-3">
                {product.reviews.length === 0 && (
                  <TextMessage>There is no review</TextMessage>
                )}
              </div> */}
              {product.reviews.length === 0 ? (
                <div className="mt-5">
                  <TextMessage>There is no review</TextMessage>
                </div>
              ) : (
                <ul className="border-primary border rounded-md p-2 bg-secondry">
                  {product.reviews.map((review) => (
                    <li key={review._id} className="mb-4">
                      <div className="flex justify-between">
                        <div className="font-nunito font-bold">
                          {review.name}
                        </div>
                        <div className="flex justify-between">
                          <Rating rating={review.rating} caption=" "></Rating>
                        </div>
                      </div>
                      <div className="font-nunito">{review.createdAt.substring(0, 10)}</div>
                      <p className="font-nunito">{review.comment}</p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="my-20">
                {userInfo ? (
                  <form onSubmit={submitHandler}>
                    <div className="font-nunito text-xl font-bold">
                      Write a customer review
                    </div>
                    <form className="mb-3 flex-col">
                      <div className="flex w-full justify-between">
                        <div className="font-nunito my-3">Rating</div>

                        <div>
                          <select
                            className="rounded-md font-nunito p-2 bg-secondry text-primary font-bold border-primary border-2"
                            aria-label="Rating"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value="">Select...</option>
                            <option value="1">1- Poor</option>
                            <option value="2">2- Fair</option>
                            <option value="3">3- Good</option>
                            <option value="4">4- Very good</option>
                            <option value="5">5- Excelent</option>
                          </select>
                        </div>
                      </div>
                    </form>
                    <textarea
                      className="w-full p-2 rounded-md bg-secondry border-2 border-primary"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    {/* <FloatingLabel
                      controlId="floatingTextarea"
                      label="Comments"
                      className=""
                    >
                      <Form.Control
                        className="w-full"
                        as="textarea"
                        placeholder="Leave a comment here"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </FloatingLabel> */}

                    <div className="mt-5 mb-10">
                      <button
                        className="py-2 px-5 bg-primary text-white rounded-full"
                        disabled={loadingCreateReview}
                        type="submit"
                      >
                        Submit
                      </button>
                      {loadingCreateReview && <Loading></Loading>}
                    </div>
                  </form>
                ) : (
                  <TextMessage>
                    Please{" "}
                    <Link to={`/signin?redirect=/product/id/${product._id}`}>
                      <u>Sign In</u>
                    </Link>{" "}
                    to write a review
                  </TextMessage>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
