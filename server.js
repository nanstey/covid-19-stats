const express = require("express");
var cors = require("cors");
const app = express();
const getData = require("./src/getData.js");

var allowedOrigins = ["http://localhost:3000", "http://yourapp.com"];
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

app.get("/", function (req, res) {
  const id = req.query.id;
  const region = getData.getRegionDataById(id);
  region.totalData = getData.formatDataForLineChart(region.data);
  region.dailyData = getData.formatDataForBarChart(region.data);

  res.json(region);
});

app.listen(process.env.PORT || 8080);
