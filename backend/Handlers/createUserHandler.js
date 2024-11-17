const AWS = require('aws-sdk');
const express = require('express');
const router = express.Router();

AWS.config.update({
    region: 'us-east-2',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'urbanThreadsUsers';

async function getHighestCustomerID() {
    try {
        const params = {
            TableName: TABLE_NAME,
            ProjectionExpression: 'customerID'
        };

        const data = await dynamoDB.scan(params).promise();
        if (data.Items.length === 0) return 0;

        const highestID = Math.max(...data.Items.map(item => parseInt(item.customerID)));
        return highestID;
    } catch (error) {
        console.error('Error getting highest customerID:', error);
        throw error;
    }
}

async function checkUsernameExists(username) {
    try {
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: 'username = :username',
            ExpressionAttributeValues: {
                ':username': username
            }
        };

        const data = await dynamoDB.scan(params).promise();
        return data.Items.length > 0;
    } catch (error) {
        console.error('Error checking username:', error);
        throw error;
    }
}

router.post('/createUser', async (req, res) => {
    try {
        const { firstName, lastName, username, passwordHash, addresses } = req.body;

        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const highestID = await getHighestCustomerID();
        const newCustomerID = (highestID + 1).toString();

        const newUser = {
            customerID: newCustomerID,
            firstName,
            lastName,
            username,
            passwordHash,
            addresses: addresses || [],
            currentCart: [],
            orderHistory: [],
            paymentMethods: []
        };


        const params = {
            TableName: TABLE_NAME,
            Item: newUser,
            ConditionExpression: 'attribute_not_exists(customerID)'
        };

        await dynamoDB.put(params).promise();

        const userResponse = { ...newUser };
        delete userResponse.passwordHash;
        
        res.status(201).json(userResponse);

    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === 'ConditionalCheckFailedException') {
            res.status(400).json({ message: 'Error creating user: CustomerID already exists' });
        } else {
            res.status(500).json({ message: 'Error creating user account' });
        }
    }
});

module.exports = router;