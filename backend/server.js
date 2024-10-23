const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

const { getProducts, getProductById } = require('./apis/getProducts');
const { getUsers, getUserById } = require('./apis/getUsers');

app.get('/products', getProducts);
app.get('/products/:id', getProductById);
app.get('/users', getUsers);
app.get('/users/:id', getUserById);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});