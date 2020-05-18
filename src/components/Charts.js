import React from "react";
import { Bar, Line } from "react-chartjs-2";

let timeFormat = "YYYY-MM-DD";

function getChartOptions(regionName, chartType) {
  return {
    aspectRatio: 1.67,
    maintainAspectRatio: false,
    responsive: true,
    title: {
      display: true,
      text: chartType + " COVID-19 Cases for " + regionName,
    },
    elements: {
      line: {
        tension: 0,
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            parser: timeFormat,
            tooltipFormat: "ll",
          },
          scaleLabel: {
            display: true,
            labelString: "Date",
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "",
          },
        },
      ],
    },
  };
}

function Charts({ lineChartDatasets, barChartDatasets, regionName }) {
  return (
    <div className="charts">
      <div className="chartContainer">
        <Line
          data={{ datasets: lineChartDatasets }}
          options={getChartOptions(regionName, "Total")}
        />
      </div>
      <div className="chartContainer">
        <Bar
          data={{ datasets: barChartDatasets }}
          options={getChartOptions(regionName, "Daily")}
        />
      </div>
    </div>
  );
}

export default Charts;
