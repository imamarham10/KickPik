// import express from 'express';
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import path from 'path';
const seedRouter = require('./routes/seedRoute.js');
// import seedRouter from './server/routes/seedRoute.js';
const productRouter = require('./routes/productRoute.js');
// import productRouter from './server/routes/productRoute.js';
const userRouter = require('./routes/userRoute.js');
// import userRouter from './server/routes/userRoute.js';
const orderRouter = require('./routes/orderRoute.js');
// import orderRouter from './server/routes/orderRoute.js';

dotenv.config();

mongoose
  .connect(
    `mongodb+srv://kickpik:kickpik@cluster0.kceesjr.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log(`connected to DB`);
  })
  .catch((error) => {
    console.log(error.message);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/keys/paypal', (req, res) => {
  res.send(
    `Act7e4JzPXGSkkpn4i8_kgjsL0Arhlb9e9g5Ie3yQ4iw9agA-E1Q63AnvAYIiqGuuwCaAxjxX7yFy5kl` ||
      'sb'
  );
});
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
