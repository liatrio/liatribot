'use strict';

const AWS = require('aws-sdk'),
      dynamo = new AWS.DynamoDB.DocumentClient();

// data: object containing id key
let save = (data) => {
  let params = {
    TableName: process.env.TABLE_NAME,
    Item: data
  };
  return new Promise((resolve, reject) => {
    dynamo.put(params, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

// attributes: array of attributes as strings
let scan = (attributes) => {
  let params = {
    TableName: process.env.TABLE_NAME,
    AttributesToGet: attributes
  };
  return new Promise((resolve, reject) => {
    dynamo.scan(params, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

module.exports = {
  save,
  scan
};;

