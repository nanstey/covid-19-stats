import firebase from "firebase";
require("firebase/firestore");
require("dotenv").config();

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

firebase.initializeApp(config);

const db = firebase.firestore();

export function getRegions() {
  return db
    .collection("regions")
    .orderBy("numTotal", "desc")
    .get()
    .then(function (querySnapshot) {
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          pruid: doc.id,
          code: data.code,
          name: data.name,
          total: data.numTotal,
        };
      });
    })
    .catch(function (error) {
      console.error("Error getting documents: ", error);
    });
}

export function getCovidDataForRegion(id) {
  return db
    .collection("covidData")
    .where("prUid", "==", id)
    .orderBy("date")
    .get()
    .then((querySnapshot) => {
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          pruid: data.prUid,
          date: data.date.toDate().toISOString().slice(0, 10),
          numconf: data.numConf,
          numtoday: data.numToday,
          numdeaths: data.numDeaths,
          numtotal: data.numTotal,
          numrecover: data.numRecover,
        };
      });
    });
}

function updateRegionTotal(prUid, numTotal) {
  db.collection("regions")
    .doc(prUid.toString())
    .set({ numTotal: numTotal }, { merge: true });
}

function updateRegionTotals() {
  db.collection("covidData")
    .orderBy("date", "desc")
    .orderBy("prUid", "asc")
    .limit(14)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        updateRegionTotal(data.prUid, data.numTotal);
      });
    })
    .catch((error) => {
      console.error("Error while updating region totals: ", error);
    });
}

function updateCovidData({
  pruid,
  prname,
  date,
  numconf,
  numprob,
  numdeaths,
  numtotal,
  numtested,
  numrecover,
  percentrecover,
  ratetested,
  numtoday,
  percentoday,
}) {
  const Ymd = date.split("-").reverse().join("-");
  const id = pruid + "-" + Ymd;

  db.collection("covidData")
    .doc(id)
    .set({
      date: firebase.firestore.Timestamp.fromDate(new Date(Ymd + " 00:00")),
      prUid: Number(pruid),
      prName: prname,
      numConf: Number(numconf),
      numProb: Number(numprob),
      numDeaths: Number(numdeaths),
      numTotal: Number(numtotal),
      numRecover: numrecover === "N/A" ? 0 : Number(numrecover),
      numTested: Number(numtested),
      numToday: Number(numtoday),
      percentRecover: Number(percentrecover),
      percentToday: Number(percentoday),
      rateTested: Number(ratetested),
    });
}

// exports.getRegions = getRegions;
// exports.getCovidDataForRegion = getCovidDataForRegion;
// exports.updateCovidData = updateCovidData;
// exports.updateRegionTotals = updateRegionTotals;
