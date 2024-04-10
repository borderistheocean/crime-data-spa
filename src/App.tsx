import { useEffect, useRef, useState } from "react";
import "./App.css";
import { postcodeValidator } from "postcode-validator";
import { useSearchParams } from "react-router-dom";
import _ from "lodash";

function App() {
  const locale = "GB";
  const [postcodeInputValue, setpostcodeInputValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [crimesList, setCrimesList] = useState([] as any);
  const previousInputValue = useRef("");
  const [inputWarning, setInputWarning] = useState(false);
  const stripWhitespace = (postcode: string) => {
    return postcode.replace(/ /g, '');
  };

  useEffect(() => {
    previousInputValue.current = postcodeInputValue;
  }, [postcodeInputValue]);

  useEffect(() => {
    const searchQuery = searchParams.get('postcode') as string;

    const arePostcodesValid = (searchQuery: string) => {
      let resultValid = true;
      searchQuery && searchQuery.split(",").forEach((postcode) => {
        if (!postcodeValidator(stripWhitespace(postcode), locale)) {
          resultValid = false;
        }
      });
      return resultValid;
    }

    if (searchQuery) {
      if (arePostcodesValid(searchQuery)) {
        setCrimesList([]);

        (async () => {
          const reqArray = searchQuery.split(",").map((x) => `http://api.getthedata.com/postcode/${stripWhitespace(x)}`)
          const fetchPostcodesLatLong = reqArray.map(endpoint => fetch(endpoint).then(response => response.json()));

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

        })().catch(err => {
          console.error(err);
        });

      } else {
        console.log("bad input")
        setInputWarning(true);
      }
    }
  }, [searchParams]);

  const crimeNavigation = crimesList.map((crimeData: any, index: number) =>
    <ul key={index.toString()}>
      {crimeData.map((c: any, i: any) => (
        <li key={i}><a href={`#${c.type}`}>{c.type}</a></li>
      ))}
    </ul>
  );

  const crimeTables = crimesList.map((crimeData: any, index: number) =>
    <>
      {crimeData.map((c: any, i: any) => (
        <>
          <h1 id={c.type}>{c.type}</h1>
          <table>
            <tr>
              <th>Postcode</th>
              <th>Month</th>
              <th>Street</th>
              <th>Status</th>
            </tr>
            {c.entries.map((d: any, ix: any) => (
              <tr>
                <td>{d.location.postcode}</td>
                <td>{d.month}</td>
                <td>{d.location.street.name}</td>
                <td>{(d.outcome_status) ? d.outcome_status.category : "ongoing"}</td>
              </tr>
            ))}
          </table>
        </>
      ))}
    </>
  );

  return (
    <div>
      <label htmlFor="postcodeInput">Postcode/s: </label>
      <input style={{ "borderColor": (inputWarning ? "red" : "initial") }} id="postcodeInput" placeholder="" value={postcodeInputValue} onChange={e => setpostcodeInputValue(e.target.value)} />
      <button onClick={() => setSearchParams({ "postcode": postcodeInputValue })}>Search</button>
      {crimeNavigation}
      {crimeTables}
    </div>
  );
}

export default App;