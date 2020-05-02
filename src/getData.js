const regions = require("../data/data.json");

function getDefaultData() {
  return {
    datasets: [
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
        label: "Deaths",
        data: [],
        fill: false,
        borderColor: "red",
        backgroundColor: "red",
      },
    ],
  };
}

function formatDataForLineChart(regionData) {
  const data = getDefaultData();

  data.datasets[0].data = regionData.map((day) => {
    return {
      x: day.date,
      y: day.numtotal,
    };
  });

  let numrecover = 0;
  data.datasets[1].data = regionData.map((day) => {
    numrecover = Math.max(
      Number.isInteger(parseInt(day.numrecover)) ? day.numrecover : 0,
      numrecover
    );

    return {
      x: day.date,
      y: numrecover,
    };
  });

  data.datasets[2].data = regionData.map((day) => {
    return {
      x: day.date,
      y: day.numdeaths,
    };
  });

  return data;
}

function formatDataForBarChart(regionData) {
  const data = getDefaultData();

  data.datasets[0].data = regionData.map((day) => {
    return {
      x: day.date,
      y: day.numtoday,
    };
  });

  let numrecover = 0;
  let lastrecover = 0;
  data.datasets[1].data = regionData.map((day) => {
    numrecover = Number.isInteger(parseInt(day.numrecover))
      ? day.numrecover
      : numrecover;
    const recovered = Math.max(numrecover - lastrecover, 0);
    lastrecover = numrecover;

    return {
      x: day.date,
      y: recovered,
    };
  });

  let numdeaths = 0;
  data.datasets[2].data = regionData.map((day) => {
    const deaths = day.numdeaths - numdeaths;
    numdeaths = day.numdeaths;

    return {
      x: day.date,
      y: deaths,
    };
  });

  return data;
}

function getRegionDataById(id) {
  return regions.find((region) => region.id === id);
}

exports.formatDataForLineChart = formatDataForLineChart;
exports.formatDataForBarChart = formatDataForBarChart;
exports.getRegionDataById = getRegionDataById;
