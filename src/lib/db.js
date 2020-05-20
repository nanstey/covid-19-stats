require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
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

function getRegions() {
    return pool.query(
        "SELECT r.pruid, r.code, r.name, MAX(rd.numtotal) as total " +
        "FROM region r " +
        "JOIN region_data rd on r.pruid = rd.pruid " +
        "WHERE hide = false " +
        "GROUP BY r.pruid, r.code, r.name " +
        "ORDER BY total DESC"
    );
}

function getRegionData(id) {
    return pool.query(
        "SELECT * " +
        "FROM region_data " +
        "WHERE pruid = $1 " +
        "AND date > '2020-03-10'" +
        "ORDER BY date",
        [id]
    );
}

exports.insertData = insertData;
exports.getRegions = getRegions;
exports.getRegionData = getRegionData;