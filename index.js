const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const queryfn = require('./assets/js/query-functions');

//Helper Functions
const getStringOrIntFromResults = (results, colName) => {
  return results[0][0][colName];
}