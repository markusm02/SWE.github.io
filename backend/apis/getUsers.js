const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getUsers = async (req, res) => {
  const params = {
    TableName: 'urbanThreadsUsers',
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Could not fetch users' });
  }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    console.log(`Fetching user with ID: ${id}`);
    const params = {
      TableName: 'urbanThreadsUsers',
      Key: {
        customerID: id,
      },
    };
  
    try {
      const data = await dynamoDB.get(params).promise();
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      console.error('Error fetching user by ID:', err);
      res.status(500).json({ error: 'Could not fetch user' });
    }
  };

module.exports = { getUsers, getUserById };