const express = require("express");
const path = require("path");
var cors = require("cors");

const { updateData } = require("./src/lib/updateData.js");
const { getRegions, getRegionData } = require("./src/lib/db.js");
const {
  formatDataForLineChart,
  formatDataForBarChart,
} = require("./src/lib/dataFormatter.js");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  "https://covid-19-stats-276205.wl.r.appspot.com/",
  "http://covid-19-stats.ca",
];

const app = express();
app.use(express.static(path.join(__dirname, "/build")));
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

app.get("/api/regions", async (req, res) => {
  try {
    const regions = await getRegions();
    res.json(regions.rows);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.get("/api/regions/:id", async (req, res) => {
  try {
    console.log(req.query);
    const regionData = await getRegionData(
      req.params.id,
      req.query.startDate,
      req.query.endDate
    );
    const response = {
      totalData: formatDataForLineChart(regionData.rows),
      dailyData: formatDataForBarChart(regionData.rows),
    };

    res.json(response);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.get("/cron/updateData", async (req, res) => {
  try {
    updateData();
    res.json("Success");
  } catch (err) {
    res.json(err);
  }
});

app.get("/*", (reqs, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.listen(process.env.PORT || 8080);
