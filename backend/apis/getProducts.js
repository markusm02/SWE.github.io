const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getFeaturedProducts = async (req, res) => {
  const params = {
    TableName: 'urbanThreadsProducts',
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    if (data.Items && data.Items.length > 0) {
      const featuredItems = data.Items.map(item => ({
        categoryID: item.categoryID,
        categoryName: item.categoryName,
        categoryImageName: item.categoryImageName,
        availableColors: item.availableColors,
        featuredProduct: item.Products && item.Products.length > 0 ? item.Products[0] : null
      }));
      console.log(featuredItems);
      res.json(featuredItems);
    } else {
      res.status(404).json({ error: 'No featured products found' });
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Could not fetch products' });
  }
};

const getAllProducts = async (req, res) => {
  const params = {
    TableName: 'urbanThreadsProducts',
  };
  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
    console.log(data.Items);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Could not fetch products' });
  }
};

const getProductsByCategory = async (req, res) => {
  const { categoryID } = req.params;
  const params = {
    TableName: 'urbanThreadsProducts',
    KeyConditionExpression: 'categoryID = :categoryID',
    ExpressionAttributeValues: {
      ':categoryID': parseInt(categoryID, 10),
    },
  };

  try {
    const data = await dynamoDB.query(params).promise();
    if (data.Items.length > 0) {
      res.json(data.Items);
      console.log(data.Items);
    } else {
      res.status(404).json({ error: 'No products found for this category' });
    }
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ error: 'Could not fetch products' });
  }
};

const getSpecificProductDetails = async (req, res) => {
  const params = {
    TableName: 'urbanThreadsProducts',
    ProjectionExpression: 'categoryID, categoryName, categoryImageName, Products',
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    console.log('Raw data from DynamoDB:', data.Items);

    const items = data.Items.map(item => ({
      categoryID: item.categoryID,
      categoryName: item.categoryName,
      categoryImageName: item.categoryImageName,
      products: item.Products ? item.Products.map(product => ({
        productID: product.productID,
        productName: product.productName,
        productColor: product.color,
        imageName: product.imageName,
      })) : [],
    }));

    res.json(items);
  } catch (err) {
    console.error('Error fetching specific product details:', err);
    res.status(500).json({ error: 'Could not fetch product details' });
  }
};

module.exports = {getFeaturedProducts, getAllProducts, getProductsByCategory, getSpecificProductDetails };