require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
});

function insertData(row) {
  pool.query(
    "INSERT INTO region_data (pruid, date, numtoday, numdeaths, numrecover, numprob, numconf, numtotal, numtested) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING",
    [
      row.pruid,
      row.date.split("-").reverse().join("-"),
      row.numtoday > 0 ? row.numtoday : 0,
      row.numdeaths > 0 ? row.numdeaths : 0,
      row.numrecover > 0 ? row.numrecover : 0,
      row.numprob > 0 ? row.numprob : 0,
      row.numconf > 0 ? row.numconf : 0,
      row.numtotal > 0 ? row.numtotal : 0,
      row.numtested > 0 ? row.numtested : 0,
    ]
  );
}

exports.insertData = insertData;
exports.pool = pool;
