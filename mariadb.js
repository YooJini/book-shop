const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bookshop',
    dateStrings: true
  });
  
module.exports = connection;