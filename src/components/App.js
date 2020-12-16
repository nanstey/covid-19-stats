import React, { useState, useEffect } from "react";
import Menus from "./Menus";
import Charts from "./Charts";
import "../style/App.css";

import { getRegions, getCovidDataForRegion } from "../services/firestore";
import {
  formatDataForLineChart,
  formatDataForBarChart,
} from "../lib/dataFormatter";

import ReactGA from "react-ga";
ReactGA.initialize(process.env.REACT_APP_GA_ID);

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

    async function getRegionsFromFirebase() {
      await getRegions().then((regions) => setRegions(regions));
    }

    getRegionsFromFirebase();
  }, []);

  useEffect(() => {
    async function getRegionsFromFirebase(id) {
      await getCovidDataForRegion(id).then((covidData) =>
        setRegionData({
          totalData: formatDataForLineChart(covidData),
          dailyData: formatDataForBarChart(covidData),
        })
      );
    }

    getRegionsFromFirebase(selectedRegion.pruid);
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
