// import express from 'express';
// import Product from '../models/productModel.js';

const express = require('express');
const Product = require('../models/productModel');

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  console.log(products);
  res.send(products);
});

productRouter.get('/:id', async (req, res) => {
  //   const product = await Product.findOne((x) => x._id === req.params.id);
  const product = await Product.findById(req.params.id);
  if (product) {
    console.log(product);
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found!' });
  }
});

// export default productRouter;
module.exports = productRouter;
