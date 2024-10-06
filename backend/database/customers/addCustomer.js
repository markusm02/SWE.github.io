const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const addCustomer = async (customerData) => {
    const params = {
        TableName: 'urbanThreadsUsers',
        Item: customerData,
    };

    try {
        await dynamoDB.put(params).promise();
        console.log('Customer added successfully!');
    } catch (err) {
        console.error('Error adding customer:', err);
    }
};

module.exports = addCustomer;