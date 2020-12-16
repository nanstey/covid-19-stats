const request = require("request");
const csv = require("csv-parser");
const fs = require("fs");

const {
  updateCovidData,
  updateRegionTotals,
} = require("../services/firestore.js");

function updateData() {
  request.get(
    "https://health-infobase.canada.ca/src/data/covidLive/covid19.csv",
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
        fs.writeFile("data/data.csv", body, (err) => {
          if (err) return console.log(err);

          fs.createReadStream("data/data.csv")
            .pipe(csv())
            .on("data", (row) => {
              updateCovidData(row);
            })
            .on("end", () => {
              updateRegionTotals();
              console.log("import complete");
              return true;
            });
        });
      } else {
        console.log(error);
        return false;
      }
    }
  );
}

// updateData();
updateRegionTotals();

exports.updateData = updateData;
