const csv = require("csv-parser");
const fs = require("fs");
const getData = require("../lib/getData.js");

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

fs.createReadStream("data/covid19.csv")
  .pipe(csv())
  .on("data", (row) => {
    let regionName = row.prname;
    regions[regionName].data.push(row);
  })
  .on("end", () => {
    fs.writeFile(
      "./data/data.json",
      JSON.stringify(regions, null, 4),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("File has been created");
      }
    );
  });
