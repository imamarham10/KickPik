import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './server/routes/seedRoute.js';
import productRouter from './server/routes/productRoute.js';
import userRouter from './server/routes/userRoute.js';

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
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// app.get('/api/products', (req, res) => {
//   console.log(data.products);
//   res.send(data.products);
// });

// app.get('/api/product/id/:id', (req, res) => {
//   const product = data.products.find((x) => x._id === req.params.id);
//   if (product) {
//     res.send(product);
//   } else {
//     res.status(404).send({ message: 'Product not found!' });
//   }
// });

// app.get('/api/products/:id', (req, res) => {
//   const product = data.products.find((x) => x._id === req.params.id);
//   if (product) {
//     res.send(product);
//   } else {
//     res.status(404).send({ message: 'Product Not Found' });
//   }
// });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
