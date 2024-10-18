const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const removeCustomer = async (event) => {
    const customerID = event.pathParameters.customerID;
    const params = {
        TableName: 'urbanThreadsUsers',
        Key: {
            customerID: customerID
        }
    };

    try {
        await dynamoDB.delete(params).promise();
        console.log('Customer removed successfully!');
    } catch (err) {
        console.error('Error removing customer:', err);
    }
};

module.exports = removeCustomer;