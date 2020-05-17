import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Chip from "@material-ui/core/Chip";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Slide } from "@material-ui/core";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
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

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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
  const [menuOpen, setMenuOpen] = useState(false);
  const trigger = useScrollTrigger({ threshold: 50 });

  useEffect(() => {
    getRegions(setRegions);
  }, []);

  useEffect(() => {
    getRegionData(selectedRegion.pruid, setRegionData);
  }, [selectedRegion]);

  return (
    <div className="App">
      <Slide in={!trigger}>
        <AppBar position="fixed">
          <Toolbar className="toolbar">
            <IconButton
              className="menuButton"
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" className={classes.title}>
              {selectedRegion && selectedRegion.name}
            </Typography>
            <SwipeableDrawer
              anchor="left"
              open={menuOpen}
              onOpen={() => setMenuOpen(true)}
              onClose={() => setMenuOpen(false)}
            >
              <List>
                {regions.map((region, index) => (
                  <ListItem
                    button
                    key={region.pruid}
                    onClick={() => {
                      setSelectedRegion(region);
                      setMenuOpen(false);
                    }}
                  >
                    <ListItemText primary={region.name} />
                    <Chip label={formatNumber(region.total)} color="primary" />
                  </ListItem>
                ))}
              </List>
            </SwipeableDrawer>
          </Toolbar>
        </AppBar>
      </Slide>

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
