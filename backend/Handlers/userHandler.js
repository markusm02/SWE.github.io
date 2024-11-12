const AWS = require('aws-sdk');
const express = require('express');
const router = express.Router();

AWS.config.update({
    region: 'us-east-2',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'urbanThreadsUsers';

router.put('/updateUser', async (req, res) => {
    const { customerID, addresses, firstName, lastName, username, passwordHash } = req.body;

    try {
        const updateParams = {
            TableName: TABLE_NAME,
            Key: { customerID },
            UpdateExpression: 'SET addresses = :addresses, firstName = :firstName, lastName = :lastName, username = :username, passwordHash = :passwordHash',
            ExpressionAttributeValues: {
                ':addresses': addresses,
                ':firstName': firstName,
                ':lastName': lastName,
                ':username': username,
                ':passwordHash': passwordHash,
            },
            ReturnValues: 'UPDATED_NEW',
        };

        await dynamoDB.update(updateParams).promise();
        res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ error: 'Could not update user information' });
    }
});

module.exports = router;