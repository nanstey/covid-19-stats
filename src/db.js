require("dotenv").config();
const { Pool, Client } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
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
module.exports = pool;
