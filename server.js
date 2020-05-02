const express = require("express");
var cors = require("cors");
const app = express();
const getData = require("./src/getData.js");
const pool = require("./src/db.js");

var allowedOrigins = ["http://localhost:3000", "http://covid-19-stats.ca"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.get("/regions", async (req, res) => {
  try {
    const regions = await pool.query(
      "SELECT r.pruid, r.code, r.name, MAX(rd.numtotal) as total " +
        "FROM region r " +
        "JOIN region_data rd on r.pruid = rd.pruid " +
        "WHERE hide = false " +
        "GROUP BY r.pruid, r.code, r.name " +
        "ORDER BY total DESC"
    );
    res.json(regions.rows);
  } catch (err) {
    console.log(err);
  }
});

app.get("/", async (req, res) => {
  try {
    const regionData = await pool.query(
      "SELECT * FROM region_data WHERE pruid = $1 ORDER BY date",
      [req.query.id]
    );
    const response = {
      totalData: getData.formatDataForLineChart(regionData.rows),
      dailyData: getData.formatDataForBarChart(regionData.rows),
    };

    res.json(response);
  } catch (err) {
    console.log(err);
  }
});

app.listen(process.env.PORT || 8080);
