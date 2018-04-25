
'use strict';

const AWS = require('aws-sdk');

const db = new AWS.DynamoDB();

let put = (data) => {
  let params = {
    Item: data,
    TableName: 'Teams'
  };
  return db.putItem(params, function(err, data) {
    if (err) return err;            // an error occurred
    else     return data;           // successful response
  });
};

module.exports = {
  put
};

