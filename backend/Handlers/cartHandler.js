const AWS = require('aws-sdk');
const express = require('express');
const router = express.Router();

AWS.config.update({
    region: 'us-east-2',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'urbanThreadsUsers';

router.post('/removeItem', async (req, res) => {
    const { customerID, productID } = req.body;

    try {
        // Fetch the current cart
        const getParams = {
            TableName: TABLE_NAME,
            Key: { customerID },
        };

        const data = await dynamoDB.get(getParams).promise();
        const currentCart = data.Item.currentCart || [];

        // Filter out the item to be removed
        const updatedCart = currentCart.filter(item => item.productID !== productID);

        // Update the cart in the database
        const updateParams = {
            TableName: TABLE_NAME,
            Key: { customerID },
            UpdateExpression: 'SET currentCart = :updatedCart',
            ExpressionAttributeValues: {
                ':updatedCart': updatedCart,
            },
            ReturnValues: 'UPDATED_NEW',
        };

        await dynamoDB.update(updateParams).promise();
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Could not remove item from cart' });
    }
});

router.post('/purchase', async (req, res) => {
    const { customerID } = req.body;

    try {
        const params = {
            TableName: TABLE_NAME,
            Key: { customerID },
            UpdateExpression: 'SET currentCart = :emptyCart',
            ExpressionAttributeValues: {
                ':emptyCart': [],
            },
            ReturnValues: 'UPDATED_NEW',
        };

        await dynamoDB.update(params).promise();
        res.status(200).json({ message: 'Purchase successful, cart cleared' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Could not clear cart' });
    }
});

router.post('/addItem', async (req, res) => {
    const { customerID, productName, productID, quantity, price } = req.body;
    try {
        // Fetch the current cart
        const getParams = {
            TableName: TABLE_NAME,
            Key: { customerID },
        };

        const data = await dynamoDB.get(getParams).promise();
        const currentCart = data.Item.currentCart || [];

        // Add the new item to the cart
        const updatedCart = [...currentCart, { productName, productID, quantity, price }];

        // Update the cart in the database
        const updateParams = {
            TableName: TABLE_NAME,
            Key: { customerID },
            UpdateExpression: 'SET currentCart = :updatedCart',
            ExpressionAttributeValues: {
                ':updatedCart': updatedCart,
            },
            ReturnValues: 'UPDATED_NEW',
        };

        await dynamoDB.update(updateParams).promise();
        res.status(200).json({ message: 'Item added to cart' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Could not add item to cart' });
    }
});

module.exports = router;