const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
