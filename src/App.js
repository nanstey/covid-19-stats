import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { Bar, Line } from "react-chartjs-2";
import "./App.css";
const axios = require("axios").default;

const axiosInstance = axios.create({ baseURL: "http://localhost:8080" });

let timeFormat = "DD-MM-YYYY";
let regionIds = [
  "CA",
  "QC",
  "ON",
  "AB",
  "BC",
  "NS",
  "SK",
  "MB",
  "NL",
  "NB",
  "PE",
  "YT",
  "NT",
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();
  const [id, setId] = useState("CA");
  const [region, setRegion] = useState({
    name: "Canada",
    totalData: [],
    dailyData: [],
  });

  useEffect(() => {
    async function getRegionData() {
      try {
        let { data } = await axiosInstance(`?id=${id}`);
        setRegion(data);
      } catch (error) {
        console.log(error);
      }
    }

    getRegionData();
  }, [id]);

  return (
    <div className="App">
      <AppBar position="fixed">
        <Toolbar className="toolbar">
          <Typography variant="h4" className={classes.title}>
            {region.name}
          </Typography>
          <ToggleButtonGroup
            variant="contained"
            color="primary"
            aria-label="contained primary button group"
          >
            {regionIds.map((regionId) => (
              <ToggleButton
                key={regionId}
                selected={regionId === id}
                onClick={() => setId(regionId)}
              >
                {regionId}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>

      <div className="charts">
        <div className="chartContainer">
          <Line
            data={region.totalData}
            options={{
              aspectRatio: 1.67,
              maintainAspectRatio: true,
              responsive: true,
              title: {
                display: true,
                text: "Total COVID-19 Cases for " + region.name,
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
            }}
          />
        </div>
        <div className="chartContainer">
          <Bar
            data={region.dailyData}
            options={{
              aspectRatio: 1.67,
              maintainAspectRatio: true,
              responsive: true,
              title: {
                display: true,
                text: "Daily COVID-19 Cases for " + region.name,
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
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
