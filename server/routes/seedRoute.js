// import express from 'express';
// import data from '../Data.js';
// import Product from '../models/productModel.js';
// import User from '../models/userModel.js';

const express = require('express');
const Product = require('../models/productModel');
const data = require('../Data');
const User = require('../models/userModel');

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  //   await //Product.deleteMany({});
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdProducts, createdUsers });
});
module.exports = seedRouter;
// export default seedRouter;
