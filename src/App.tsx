import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { postcodeValidator } from "postcode-validator";
import { useSearchParams } from "react-router-dom";

function App() {
  const locale = "GB";
  const [postcodeInputValue, setpostcodeInputValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const stripWhitespace = (postcode: string) => {
    return postcode.replace(/ /g, '');
  };

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
      searchQuery.split(",").forEach((postcode, index) => {
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
                        response.data.forEach((crimeData: any, index: number) => {
                          console.log(`<<< result ${index}`)
                          // Category
                          console.log(crimeData.category)
                          // Postcode
                          console.log(postcode)
                          // Date of crime
                          console.log(crimeData.month)
                          // Approximate street name
                          console.log(crimeData.location.street.name)
                          // Outcome status
                          console.log(crimeData.outcome_status.category)
                          console.log(">>>")
                        });
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
    }

  }, [searchParams]);

  return (
    <div>
      <label htmlFor="postcodeInput">Postcode/s: </label>
      <input id="postcodeInput" placeholder="" value={postcodeInputValue} onChange={e => setpostcodeInputValue(e.target.value)} />
      <button onClick={() => setSearchParams({ "postcode": postcodeInputValue })}>Search</button>
    </div>
  );
}

export default App;