const regions = require("../data/data.json");

function getDefaultData() {
  return [
    {
      label: "Confirmed Cases",
      data: [],
      fill: false,
      borderColor: "blue",
      backgroundColor: "blue",
    },
    {
      label: "Recovered",
      data: [],
      fill: false,
      borderColor: "green",
      backgroundColor: "green",
    },
    {
      label: "Active",
      data: [],
      fill: false,
      borderColor: "orange",
      backgroundColor: "orange",
    },
    {
      label: "Deaths",
      data: [],
      fill: false,
      borderColor: "red",
      backgroundColor: "red",
    },
  ];
}

function formatDataForLineChart(regionData) {
  const data = getDefaultData();

  let numrecover = 0;
  regionData.forEach((day) => {
    data[0].data.push({
      x: day.date,
      y: day.numtotal,
    });

    numrecover = Math.max(
      Number.isInteger(parseInt(day.numrecover)) ? day.numrecover : 0,
      numrecover
    );
    data[1].data.push({
      x: day.date,
      y: numrecover,
    });

    data[2].data.push({
      x: day.date,
      y: day.numtotal - day.numdeaths - numrecover,
    });

    data[3].data.push({
      x: day.date,
      y: day.numdeaths,
    });
  });

  return data;
}

function formatDataForBarChart(regionData) {
  const data = getDefaultData();

  let numrecover = 0;
  let lastrecover = 0;
  let numdeaths = 0;
  regionData.forEach((day) => {
    data[0].data.push({
      x: day.date,
      y: day.numtoday,
    });

    numrecover = Number.isInteger(parseInt(day.numrecover))
      ? day.numrecover
      : numrecover;
    const recovered = Math.max(numrecover - lastrecover, 0);
    lastrecover = numrecover;

    data[1].data.push({
      x: day.date,
      y: recovered,
    });

    const deaths = day.numdeaths - numdeaths;
    numdeaths = day.numdeaths;
    data[3].data.push({
      x: day.date,
      y: deaths,
    });
  });

  data.splice(2, 1);

  return data;
}

function getRegionDataById(id) {
  return regions.find((region) => region.id === id);
}

exports.formatDataForLineChart = formatDataForLineChart;
exports.formatDataForBarChart = formatDataForBarChart;
exports.getRegionDataById = getRegionDataById;
