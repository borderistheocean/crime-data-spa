import { useEffect, useRef, useState } from "react";
import "./App.css";
import { postcodeValidator } from "postcode-validator";
import { useSearchParams } from "react-router-dom";
import _ from "lodash";
import History from "./History";

function App() {
  const locale = "GB";
  const [postcodeInputValue, setpostcodeInputValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [crimesList, setCrimesList] = useState([] as any);
  const storedhistory = JSON.parse(localStorage.getItem("history") || "[]");
  const [history, setHistory] = useState(storedhistory)

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
      setCrimesList([]);

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

                  // Chain reponses so they're grouped by category
                  const chained = _.chain(flatten).groupBy("category").map((value, key) => ({ type: key, entries: value })).value();

                  // Remove redundant category property
                  _.forEach(chained, function (crimes) {
                    _.forEach(crimes.entries, function (entry) {
                      delete entry.category;
                    });
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

  const crimeNavigation = crimesList.map((crimeData: any, index: number) =>
    <ul key={index.toString()}>
      {crimeData.map((c: any, i: any) => (
        <li key={i}><a href={`#${c.type}`}>{c.type}</a></li>
      ))}
    </ul>
  );

  const crimeTables = crimesList.map((crimeData: any) =>
    <>
      {crimeData.map((crime: any) => (
        <>
          <h1 id={crime.type}>{crime.type}</h1>
          <table>
            <thead>
              <tr>
                <th>Postcode</th>
                <th>Month</th>
                <th>Street</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {crime.entries.map((details: any, index: any) => (
                <tr key={index}>
                  <td>{details.location.postcode}</td>
                  <td>{details.month}</td>
                  <td>{details.location.street.name}</td>
                  <td>{(details.outcome_status) ? details.outcome_status.category : "ongoing"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ))}
    </>
  );

  const handleSubmit = (postCodeValue: any) => {
    setSearchParams({ "postcode": postCodeValue });

    if (history) if (history.indexOf(postCodeValue) === -1)
      setHistory([...history, postCodeValue]);
  }

  const removeEntry = (entryToRemove: any) => {
    const newHistory = history.filter((entry: any) => entry !== entryToRemove);
    setHistory(newHistory);

    if (entryToRemove === searchParams.get('postcode') as string) {
      setSearchParams({ "postcode": "" });
      setCrimesList([]);
      setpostcodeInputValue("");
    }
  }

  return (
    <div>
      <div>
        <label htmlFor="postcodeInput">Postcode/s: </label>
        <input id="postcodeInput" placeholder="" value={postcodeInputValue} onChange={e => setpostcodeInputValue(e.target.value)} />
        <button onClick={() => handleSubmit(postcodeInputValue)}>Search</button>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          {crimeNavigation}
        </div>
        <div style={{ flex: 2 }}>
          {crimeTables}
        </div>
        <div style={{ flex: 1 }}>
          <h1>Map</h1>
        </div>
        <div style={{ flex: 1 }}>
          <h1>History</h1>
          <History removeEntry={(e: any) => removeEntry(e)} entries={history} clearHistory={() => setHistory([])} updateParameters={(e: any) => handleSubmit(e.postcode)} title={"history"} />
          <div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;