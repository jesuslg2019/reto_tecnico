const serverless = require('serverless-http')
const express = require('express')
const app = express()
const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
if (process.env.JEST_WORKER_ID) {
    var config = {
        convertEmptyValues: true,
        ...(process.env.JEST_WORKER_ID && {
            endpoint: 'http://localhost:8000',
            sslEnabled: false,
            region: 'local-env',
        }),
    };
    var dynamoDb = new AWS.DynamoDB.DocumentClient(config);
} else {
    var dynamoDb = new AWS.DynamoDB.DocumentClient()
}
const getMyData = async (req) => {
    try {
        const params = { TableName: 'mydata' }
        // obtengo los items dynamodb
        let result = {}
        await dynamoDb.scan(params, function (err, data) {
            if (err) console.log(err);
            else result = data;
        }).promise()

        return {
            status: 200,
            message: "ok",
            data: result
        }
    } catch (error) {
        return {
            status: 404,
            message: "error"
        }
    }
}

app.get('/my-data', async (req, res) => {
    const data = await getMyData(req)
    res.send({ ...data })
})

module.exports = {
    getMyData,
    handler: serverless(app)
}

