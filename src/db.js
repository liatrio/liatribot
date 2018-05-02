'use strict';

const AWS = require('aws-sdk'),
      dynamo = new AWS.DynamoDB.DocumentClient();


/**
 * Save
 *
 * @param {Object} Data - The data to save
 * @return {Promise} A Promise with the results
 */
let save = (data) => {
  let params = {
    TableName: process.env.TABLE_NAME,
    Item: data
  };
  return new Promise((resolve, reject) => {
    dynamo.put(params, (err, data) => {
      err ? reject(err) : resolve(data);
    })
  });
}

/**
 * Dynamo Get
 *
 * @param {String} id - The record's key
 * @return {Promise} A Promise with the get result
 */
/*exports.get = function(id) {
  return this.query('get', { Key: { id: id } }).then(d => {
    return Promise.resolve(d.Item);
  });
}


/**
 * Dynamo Query
 *
 * @param {String} name - The query action to run
 * @param {Object} params - The query parameters
 * @return {Promise} A Promise with the get result
 */
/*exports.query = function(method, params) {
  params.TableName = process.env.TABLE_NAME;

  return new Promise((resolve, reject) => {
    dynamo[method](params, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}*/

module.exports = {
  save
};
