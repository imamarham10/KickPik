import React, { useEffect, useState, useContext, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../util.js";
import Loading from "../components/Loading";
import ErrorMessage from "../components/Message";

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
      return { ...state, loadingUpdate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, errorUpdate, loadingUpload, errorUpload }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          price,
          image,
          category,
          brand,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      window.alert("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      window.alert(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      window.alert('Image uploaded successfully');
      setImage(data.secure_url);
    } catch (err) {
      window.alert(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <div className="font-nunito font-bold text-lg">
            Edit Product {productId}
          </div>
        </div>
        {loadingUpdate && <Loading />}
                {errorUpdate && <ErrorMessage variant="danger">{errorUpdate}</ErrorMessage>}
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        ) : (
          <>
            <div>
              <label htmlFor="name" className="font-nunito font-bold">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="price" className="font-nunito font-bold">
                Price
              </label>
              <input
                id="price"
                type="text"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="image" className="font-nunito font-bold">
                Image
              </label>
              <input
                id="image"
                type="text"
                placeholder="Enter image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="imageFile" className="font-nunito font-bold">
                Image File
              </label>
              <input
                type="file"
                id="imageFile"
                label="Choose Image"
                className="rounded-full"
                onChange={uploadFileHandler}
              />
              {loadingUpload && <Loading />}
                            {errorUpload && <ErrorMessage variant="danger">{errorUpload}</ErrorMessage>}
            </div>
            <div>
              <label htmlFor="category" className="font-nunito font-bold">
                Category
              </label>
              <input
                id="category"
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="brand" className="font-nunito font-bold">
                Brand
              </label>
              <input
                id="brand"
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="countInStock" className="font-nunito font-bold">
                Count In Stock
              </label>
              <input
                id="countInStock"
                type="text"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description" className="font-nunito font-bold">
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label />
              <button
                className="primary cartpage-checkout"
                disabled={loadingUpdate}
                type="submit"
              >
                Update
              </button>
              {loadingUpdate && <Loading></Loading>}
            </div>
          </>
        )}
      </form>
    </div>
  );
}
