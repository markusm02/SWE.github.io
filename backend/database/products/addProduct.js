const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const addProduct = async (productData) => {
    const params = {
        TableName: 'urbanThreadsProducts',
        Item: productData,
    };

    try {
        await dynamoDB.put(params).promise();
        console.log('Product added successfully!');
    } catch (err) {
        console.error('Error adding item:', err);
    }
};

module.exports = addProduct;