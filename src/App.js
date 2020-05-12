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

const axiosInstance = axios.create();

let timeFormat = "YYYY-MM-DD";

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

async function getRegions(cb) {
  try {
    let { data } = await axiosInstance(`/api/regions`);
    cb(data);
  } catch (error) {
    console.log(error);
  }
}

async function getRegionData(id, cb) {
  try {
    let { data } = await axiosInstance(`/api/regions/${id}`);
    cb(data);
  } catch (error) {
    console.log(error);
  }
}

function App() {
  const classes = useStyles();
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState({
    pruid: 1,
    name: "Canada",
    code: "CA",
  });
  const [regionData, setRegionData] = useState({
    totalData: [],
    dailyData: [],
  });

  useEffect(() => {
    getRegions(setRegions);
  }, []);

  useEffect(() => {
    getRegionData(selectedRegion.pruid, setRegionData);
  }, [selectedRegion]);

  return (
    <div className="App">
      <AppBar position="fixed">
        <Toolbar className="toolbar">
          <Typography variant="h4" className={classes.title}>
            {selectedRegion && selectedRegion.name}
          </Typography>
          <ToggleButtonGroup
            variant="contained"
            color="primary"
            aria-label="contained primary button group"
          >
            {regions &&
              regions.map((region) => (
                <ToggleButton
                  key={region.pruid}
                  selected={region.pruid === selectedRegion.pruid}
                  onClick={() => setSelectedRegion(region)}
                >
                  {region.code}
                </ToggleButton>
              ))}
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>

      <div className="charts">
        <div className="chartContainer">
          <Line
            data={regionData.totalData}
            options={{
              aspectRatio: 1.67,
              maintainAspectRatio: true,
              responsive: true,
              title: {
                display: true,
                text: "Total COVID-19 Cases for " + selectedRegion.name,
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
            }}
          />
        </div>
        <div className="chartContainer">
          <Bar
            data={regionData.dailyData}
            options={{
              aspectRatio: 1.67,
              maintainAspectRatio: true,
              responsive: true,
              title: {
                display: true,
                text: "Daily COVID-19 Cases for " + selectedRegion.name,
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
