const request = require("request");
const csv = require("csv-parser");
const fs = require("fs");

const { insertData } = require("./db.js");

const regions = {
  Canada: {
    name: "Canada",
    id: "CA",
    data: [],
  },
  Alberta: {
    name: "Alberta",
    id: "AB",
    data: [],
  },
  "British Columbia": {
    name: "British Columbia",
    id: "BC",
    data: [],
  },
  Ontario: {
    name: "Ontario",
    id: "ON",
    data: [],
  },
  Saskatchewan: {
    name: "Saskatchewan",
    id: "SK",
    data: [],
  },
  Manitoba: {
    name: "Manitoba",
    id: "MA",
    data: [],
  },
  "New Brunswick": {
    name: "New Brunswick",
    id: "NB",
    data: [],
  },
  "Newfoundland and Labrador": {
    name: "Newfoundland and Labrador",
    id: "NF",
    data: [],
  },
  "Northwest Territories": {
    name: "Northwest Territories",
    id: "NT",
    data: [],
  },
  "Nova Scotia": {
    name: "Nova Scotia",
    id: "NS",
    data: [],
  },
  Nunavut: {
    name: "Nunavut",
    id: "NV",
    data: [],
  },
  "Prince Edward Island": {
    name: "Prince Edward Island",
    id: "PE",
    data: [],
  },
  "Repatriated travellers": {
    name: "Repatriated Travellers",
    id: "RT",
    data: [],
  },
  Quebec: {
    name: "Quebec",
    id: "QC",
    data: [],
  },
  Yukon: {
    name: "Yukon",
    id: "YK",
    data: [],
  },
};

function updateData() {
  request.get(
      "https://health-infobase.canada.ca/src/data/covidLive/covid19.csv",
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          fs.writeFile("data/data.csv", body, (err) => {
            if (err) return console.log(err);

            fs.createReadStream("data/data.csv")
                .pipe(csv())
                .on("data", (row) => {
                  insertData(row);
                })
                .on("end", () => {
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

exports.updateData = updateData;