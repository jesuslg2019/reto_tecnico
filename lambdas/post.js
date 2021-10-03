const serverless = require('serverless-http')
const express = require('express')
// const axios = require('axios')
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

const { hash } = require('../tools/')
const { main } = require('../services/swapi')

const sendData = async (req) => {
    const table = "mydata"
    const { service, number } = req.query
    const data = await main(service, number)

    //Armo el json para setear
    var params = {
        TableName: table,
        Item: {
            ID: hash(),
            ...data
        }
    }
    // console.log("insertar", params)
    try {
        //Set data en dynamodb
        await dynamoDb.put(params, error => {
            // console.log('putting data')
            if (error) {
                // console.log(`Error saving data to DynamoDB: ${JSON.stringify(error)}`);
                return Promise.reject(
                    `Error saving data to DynamoDB: ${JSON.stringify(error)}`
                )
            } else {
                // console.log('data saved')
                return Promise.resolve(params.Item)
            }
        }).promise()

        return {
            status: 201,
            message: "ok",
            data: {
                ...data
            }
        }
    } catch (error) {
        return {
            status: 404,
            message: "error"
        }
    }

}

app.post('/', async (req, res) => {
    //Obtengo el planeta para setear a la bd
    const data = sendData(req)
    res.send({ ...data })


})

module.exports = {
    sendData,
    handler: serverless(app)
}