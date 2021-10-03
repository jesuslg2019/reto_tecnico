module.exports = {
    tables: [
        {
            TableName: `mydata`,
            KeySchema: [{ AttributeName: 'ID', KeyType: 'HASH' }],
            AttributeDefinitions: [{ AttributeName: 'ID', AttributeType: 'S' }],
            BillingMode: 'PAY_PER_REQUEST'
            // ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1}
        }
        // etc
    ],
    // port: 8000
};