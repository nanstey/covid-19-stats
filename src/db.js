require("dotenv").config();
const { Pool, Client } = require("pg");
const connectionString = "NOT_A_REAL_CONNECTION_STRING";
const pool = new Pool({
  connectionString: connectionString,
});

pool.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
  pool.end();
});

const client = new Client({
  connectionString: connectionString,
});

client.connect();

client.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
  client.end();
});
