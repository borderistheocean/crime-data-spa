import { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import { postcodeValidator } from "postcode-validator";
import { useSearchParams } from "react-router-dom";
import _ from "lodash";

function App() {
  const locale = "GB";
  const [postcodeInputValue, setpostcodeInputValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [crimesList, setCrimesList] = useState([] as any);
  const previousInputValue = useRef("");

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

    if (arePostcodesValid(searchQuery)) {
      setCrimesList([]);
      searchQuery && searchQuery.split(",").forEach((postcode, index) => {
        const trimmedPostcode = stripWhitespace(postcode);

        if (postcodeValidator(trimmedPostcode, locale)) {
          setTimeout(() => {
            axios.get(`http://api.getthedata.com/postcode/${trimmedPostcode}`)
              .then(function (response) {

                if (response.data.status === "match" && response.data.data.latitude && response.data.data.longitude) {
                  axios.post(`https://data.police.uk/api/crimes-street/all-crime?lat=${response.data.data.latitude}&lng=${response.data.data.longitude}`)
                    .then(function (response) {
                      // Reponse for street crime query
                      console.log(response);

                      if (response.data) {
                        response.data.forEach((crimeData: any) => {
                          crimeData.postcode = trimmedPostcode;
                        });

                        if (response.data.length > 0) {
                          // Group elements of crimes by crime type           
                          // # TODO: remove category property from within entries
                          // # TODO: merge crime data arrays with every subsequent data fetch          
                          const chained = _.chain(response.data).groupBy("category").map((value, key) => ({ type: key, entries: value })).value();
                          setCrimesList((crimesList: any) => [...crimesList, { "data": chained }]);
                        }
                      }
                    })
                    .catch(function (error) {
                      console.log(error);
                    })
                }
              })
              .catch(function (error) {
                console.log(error);
              })
          }, index * 1000);
        }
      });

      // Set postcode input value in input field on initial page load if parameter is present
      if (previousInputValue.current === "" && searchQuery) {
        setpostcodeInputValue(searchQuery)
      }
    }
  }, [searchParams]);

  const crimeNavigation = crimesList.map((crimeData: any, index: number) =>
    <ul key={index.toString()}>
      {crimeData.data.map((c: any, i: any) => (
        <li key={i}><a href={`#${c.type}`}>{c.type}</a></li>
      ))}
    </ul>
  );

  const crimeTables = crimesList.map((crimeData: any, index: number) =>
    <>
      {crimeData.data.map((c: any, i: any) => (
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
                <td>{d.postcode}</td>
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
      <input id="postcodeInput" placeholder="" value={postcodeInputValue} onChange={e => setpostcodeInputValue(e.target.value)} />
      <button onClick={() => setSearchParams({ "postcode": postcodeInputValue })}>Search</button>
      {crimeNavigation}
      {crimeTables}
    </div>
  );
}

export default App;