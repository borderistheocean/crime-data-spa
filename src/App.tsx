import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { postcodeValidator } from "postcode-validator";
import { useSearchParams } from "react-router-dom";
import _ from "lodash";
import History from "./History/History";
import date from 'date-and-time';
import Navigation from "./Navigation/Navigation";
import Map from "./Map/Map";
import CrimeRecords from "./CrimeRecords/CrimeRecords";

function App() {
  const locale = "GB";
  const [postcodeInputValue, setpostcodeInputValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams("");
  const [crimesList, setCrimesList] = useState([] as any);
  const storedhistory = JSON.parse(localStorage.getItem("history") || "[]");
  const [history, setHistory] = useState(storedhistory);
  const [resultTotal, setResultTotal] = useState(0);
  const previousInputValue = useRef("");

  const stripWhitespace = (postcode: string) => {
    return postcode.replace(/ /g, '');
  };

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    previousInputValue.current = postcodeInputValue;
  }, [postcodeInputValue]);

  useEffect(() => {
    const searchQuery = searchParams.get('postcode') as string;

    if (searchQuery) {
      const now = new Date();
      const timeAndDateNow = date.format(now, 'DD/MM/YYYY HH:mm:ss');

      setCrimesList([]);
      setResultTotal(0);
      setHistory((history: any) => [{ "postcode": searchQuery, "time": timeAndDateNow }, ...history]);
      (async () => {
        const filterValidPostcodes = searchQuery.split(",").filter((postcode) => postcodeValidator(stripWhitespace(postcode), locale))

        if (filterValidPostcodes.length > 0) {
          const postCodeSearchRequests = filterValidPostcodes.map((x) => `http://api.getthedata.com/postcode/${stripWhitespace(x)}`)
          const fetchPostcodesLatLong = postCodeSearchRequests.map(endpoint => fetch(endpoint).then(response => response.json()));

          // Process the requests and responses
          await Promise.all(fetchPostcodesLatLong)
            .then(async postCodeResponses => {
              const latLongRequests = postCodeResponses.map((x) => `https://data.police.uk/api/crimes-street/all-crime?lat=${x.data.latitude}&lng=${x.data.longitude}`);
              const fetchLatLongCrimeDataReq = latLongRequests.map(endpoint => fetch(endpoint).then(response => response.json()));

              await Promise.all(fetchLatLongCrimeDataReq)
                .then(latLongResponses => {

                  // Map postcode property to corresponding dataset
                  _.forEach(postCodeResponses, function (postCodeResponse, index) {
                    _.forEach(latLongResponses[index], function (entry) {
                      entry.location.postcode = postCodeResponse.input;
                    });
                  });

                  // Combine reponses into single dataset
                  const flatten = _.flatten(latLongResponses);
                  setResultTotal(flatten.length);

                  // Chain reponses so they're grouped by category
                  const chained = _.chain(flatten).groupBy("category").map((value, key) => ({ type: key, entries: value })).value();

                  // Remove redundant category property
                  _.forEach(chained, function (crimes) {
                    _.forEach(crimes.entries, function (entry) {
                      delete entry.category;
                    });
                  });

                  // Replace dashes for types and change casing 
                  _.forEach(chained, function (crimes) {
                    crimes.type = crimes.type.replace(/-/g, " ");
                    crimes.type = crimes.type.replace(/(^|\s)[a-z]/gi, l => l.toUpperCase());
                  });

                  setCrimesList((crimesList: any) => [...crimesList, chained]);
                });
            })
            .catch(error => {
              // Handle any errors
              console.log(error);
            });

          // Set postcode input value in input field on initial page load if parameter is present
          if (previousInputValue.current === "" && searchQuery) {
            setpostcodeInputValue(searchQuery)
          }
        }
      })().catch(err => {
        console.error(err);
      });
    }
  }, [searchParams]);

  const handleSubmit = (postCodeValue: any) => {
    if (postCodeValue === searchParams.get('postcode') as string) {
      window.location.reload();
    } else {
      setSearchParams({ "postcode": postCodeValue });
    }
  };

  const handleSubmitHistory = (postCodeValue: any) => {
    handleSubmit(postCodeValue);
    setpostcodeInputValue(postCodeValue);
  };

  const removeEntry = (entryToRemove: any) => {
    const newHistory = history.filter((entry: any, index: any) => index !== entryToRemove);

    if (history[entryToRemove].postcode === searchParams.get('postcode') as string) {
      setSearchParams({ "postcode": "" });
      setCrimesList([]);
      setpostcodeInputValue("");
    }

    setHistory(newHistory);
  };

  return (
    <div id={"appWrapper"}>
      <div id={"appCrimesBanner"} style={{ display: "flex" }}>
        <div id={"appCrimesTitle"} style={{ flex: 1 }}>
          Crime Data SPA
        </div>
        <div id={"appCrimesInputWrapper"} style={{ flex: 4, display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div id={"appCrimesInput"}>
            <input placeholder={""} value={postcodeInputValue} onChange={e => setpostcodeInputValue(e.target.value)} />
            <button onClick={() => handleSubmit(postcodeInputValue)}>Search</button>
          </div>
        </div>
        <div id={"appCrimesStub"} style={{ flex: 1 }}>
        </div>
      </div>
      <div id={"appMain"} style={{ display: "flex" }}>
        <div id={"appCrimesNav"} style={{ flex: 1 }}>
          <h3>Navigate by crime type</h3>
          <Navigation crimesList={crimesList} />
          <h3>Map</h3>
          <Map />
        </div>
        <div id={"appCrimesList"} style={{ flex: 4 }}>
          <h1>{`Showing ${resultTotal} crimes for ${searchParams.get('postcode') as string}`}</h1>
          <CrimeRecords crimesList={crimesList} />
        </div>
        <div id={"appCrimesHistory"} style={{ flex: 1 }}>
          <h3>Search history</h3>
          <History removeEntry={(e: any) => removeEntry(e)} entries={history} clearHistory={() => setHistory([])} updateParameters={(e: any) => handleSubmitHistory(e.postcode)} title={"history"} />
          <div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;