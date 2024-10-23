const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getProducts = async (req, res) => {
  const params = {
    TableName: 'urbanThreadsProducts',
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Could not fetch products' });
  }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    console.log(`Fetching product with ID: ${id}`);
    const params = {
      TableName: 'urbanThreadsProducts',
      Key: {
        productID: id,
      },
    };
  
    try {
      const data = await dynamoDB.get(params).promise();
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      res.status(500).json({ error: 'Could not fetch product' });
    }
  };
module.exports = {getProducts, getProductById};