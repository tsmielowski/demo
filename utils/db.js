const dotenv = require('dotenv');
const mysql = require('mysql');
const result = dotenv.config();
 
if (result.error) {
  throw result.error;
}

const getNow = () => mysql.raw('NOW()');
const pool = mysql.createPool({
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  user: process.env.DB_USER
});

module.exports = {
  getNow,
  pool
};