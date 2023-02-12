import express from 'express';
import data from './server/Data.js';
import cors from 'cors';
const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.get('/api/products', (req, res) => {
  console.log(data.products);
  res.send(data.products);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
