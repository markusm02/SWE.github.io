const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
const { getFeaturedProducts, getAllProducts, getProductsByCategory, getSpecificProductDetails } = require('./apis/getProducts');
const { getUsers, getUserById } = require('./apis/getUsers');
const cartHandler = require('./Handlers/cartHandler'); 
const userHandler = require('./Handlers/userHandler');
const createUserHandler = require('./Handlers/createUserHandler');


app.get('/users', getUsers);
app.get('/users/:id', getUserById);
app.use('/cart', cartHandler);
app.use('/user', userHandler);
app.use('/users', createUserHandler);

app.get('/featured-products', getFeaturedProducts);
app.get('/all-products', getAllProducts);
app.get('/products-by-category/:categoryID', getProductsByCategory);
app.get('/specific-product-details', getSpecificProductDetails);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});