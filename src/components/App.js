import React, { useState, useEffect } from "react";
import Menus from "./Menus";
import Charts from "./Charts";
import "../style/App.css";

import ReactGA from "react-ga";
ReactGA.initialize(process.env.REACT_APP_GA_ID);

const axios = require("axios").default;
const axiosInstance = axios.create();

async function getRegions(cb) {
  try {
    let { data } = await axiosInstance(`/api/regions`);
    cb(data);
  } catch (error) {
    console.log(error);
  }
}

const startDate = "2020-03-15";
const endDate = "2020-05-15";

async function getRegionData(id, cb) {
  try {
    let { data } = await axiosInstance(
      `/api/regions/${id}?startDate=${startDate}&endDate=${endDate}`
    );
    cb(data);
  } catch (error) {
    console.log(error);
  }
}

function App() {
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
    ReactGA.pageview(window.location.pathname + window.location.search);
    getRegions(setRegions);
  }, []);

  useEffect(() => {
    getRegionData(selectedRegion.pruid, setRegionData);
  }, [selectedRegion]);

  return (
    <div className="App">
      <Menus
        regions={regions}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />
      <Charts
        lineChartDatasets={regionData.totalData}
        barChartDatasets={regionData.dailyData}
        regionName={selectedRegion.name}
      />
    </div>
  );
}

export default App;
