const serverless = require('serverless-http')
const express = require('express')
// const axios = require('axios')
const app = express()
// const AWS = require('aws-sdk')
// AWS.config.update({ region: 'us-east-1' })
// const dynamoDb = new AWS.DynamoDB.DocumentClient()
const { main } = require('../services/swapi')

const getPlanets = async (req) => {
  const { service, number } = req.query
  try {
    const result = await main(service, number)
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

app.get('/', async (req) => {
  const data = await getPlanets(req)
  res.send({ ...data })
})

module.exports = {
  getPlanets,
  handler: serverless(app),


}

