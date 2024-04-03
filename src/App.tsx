import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { postcodeValidator, postcodeValidatorExistsForCountry } from 'postcode-validator';

function App() {
  const [postcodeInputValue, setpostcodeInputValue] = useState("");

  const getPostCodeData = (searchQuery: string) => {
    searchQuery.split(",").forEach((postcode, index) => {
      if (postcodeValidatorExistsForCountry('GB') && postcodeValidator(postcode, 'GB')) {
        setTimeout(() => {
          const trimPostcode = postcode.trim();

          axios.get(`http://api.getthedata.com/postcode/${trimPostcode}`)
            .then(function (response) {
              if (response.data.status === "match" && response.data.data.latitude && response.data.data.longitude) {
                axios.post(`https://data.police.uk/api/crimes-street/all-crime?lat=${response.data.data.latitude}&lng=${response.data.data.longitude}`)
                  .then(function (response) {
                    // Reponse for street crime
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
                    // handle error
                    console.log(error);
                  })
                  .finally(function () {
                    // always executed
                  });
              }
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .finally(function () {
              // always executed
            });
        }, index * 1000);
      }
    });
  }

  return (
    <div className="App">
      <label htmlFor="postcodeInput">Postcode/s: </label>
      <input id="postcodeInput" placeholder="" value={postcodeInputValue} onChange={e => setpostcodeInputValue(e.target.value)} />
      <button onClick={() => getPostCodeData(postcodeInputValue)}>Search</button>
    </div>
  );
}

export default App;