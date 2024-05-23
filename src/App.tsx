import { useEffect, useRef, useState } from "react";
import { postcodeValidator } from "postcode-validator";
import { useSearchParams } from "react-router-dom";
import _ from "lodash";
import History from "./History/History";
import date from 'date-and-time';
import Navigation from "./Navigation/Navigation";
import Map from "./Map/Map";
import CrimeRecords from "./CrimeRecords/CrimeRecords";
import { Layout, Space } from 'antd';
import Search from "antd/es/input/Search";
import Text from "antd/es/typography/Text";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import "./App.scss";

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
    <>
      <div >
        <Layout className="h-screen w-screen">
          <Sider>
            
         <div className="flex h-full">
           <div className="flex-auto w-1/4 p-5 overflow-y-auto">
             {(resultTotal !== 0) &&
               <>
                 <Text>Navigate by crime type</Text>
                 <Navigation crimesList={crimesList} />
                 <Text>Map</Text>
                 <Map/>
               </>
             }
           </div>
    </div>

          </Sider>
          <Layout>
            <Header>


                    <h1>Crime Data SPA</h1>

                    <Space direction="vertical">
                      <Search
                        id={"postCodeSearchInput"}
                        placeholder="Enter one or more postcodes"
                        onChange={e => setpostcodeInputValue(e.target.value)}
                        value={postcodeInputValue}
                        onSearch={() => handleSubmit(postcodeInputValue)}
                        style={{
                          width: 250
                        }}
                      />
                    </Space>
 

            </Header>
            <Content>
              
        <div className="flex h-full">

          <div className="flex-auto w-3/4	p-5 overflow-y-auto">
            {(resultTotal === 0) &&
              <div className="flex items-center justify-center w-full h-full">
                <div>
                  {(searchParams.get('postcode') == null && resultTotal == 0) &&
                    <h2>Enter postcode/s to search for crimes.</h2>
                  }
                  {(searchParams.get('postcode') != null && resultTotal == 0) &&
                    <h2>No results found for {searchParams.get('postcode')}.</h2>
                  }
                </div>
              </div>
            }
            {(searchParams.get('postcode') != null && resultTotal > 0) &&
              <>
                <Text>{`Showing ${resultTotal} crimes for ${searchParams.get('postcode') as string}`}</Text>
                <CrimeRecords crimesList={crimesList} />
              </>
            }
          </div>
          <div className="flex-auto w-1/4 p-5 overflow-y-auto">
            <h3>Search history</h3>
            <History removeEntry={(e: any) => removeEntry(e)} entries={history} clearHistory={() => setHistory([])} updateParameters={(e: any) => handleSubmitHistory(e.postcode)} title={"history"} />
            <div>
            </div>
          </div>
        </div>

            </Content>
            <Footer>An SPA by Luke Rakowski</Footer>
          </Layout>
        </Layout>
      </div>
    </>

    // <div className="flex flex-col h-screen">
    //   <header className="bg-gray-400">
    //     <div className="flex text-white bg-blue-500 shadow-md">
    //       <div className="flex flex-row items-center flex-1 p-5 ">
    //         Crime Data SPA
    //       </div>
    //       <div className="p-5">
    //         <div>
    //           <Space direction="vertical">
    //             <Search
    //               id={"postCodeSearchInput"}
    //               placeholder="Enter one or more postcodes"
    //               onChange={e => setpostcodeInputValue(e.target.value)}
    //               value={postcodeInputValue}
    //               onSearch={() => handleSubmit(postcodeInputValue)}
    //               style={{
    //                 width: 250
    //               }}
    //             />
    //           </Space>
    //         </div>
    //       </div>
    //     </div>
    //   </header>
      // <main className="flex-grow overflow-hidden">
      //   <div className="flex h-full">
      //     <div className="flex-auto w-1/4 p-5 overflow-y-auto">
      //       {(resultTotal !== 0) &&
      //         <>
      //           <Text>Navigate by crime type</Text>
      //           <Navigation crimesList={crimesList} />
      //           <Text>Map</Text>
      //           <Map/>
      //         </>
      //       }
      //     </div>
      //     <div className="flex-auto w-2/4	p-5 overflow-y-auto">
      //       {(resultTotal === 0) &&
      //         <div className="flex items-center justify-center w-full h-full">
      //           <div>
      //             {(searchParams.get('postcode') == null && resultTotal == 0) &&
      //               <h2>Enter postcode/s to search for crimes.</h2>
      //             }
      //             {(searchParams.get('postcode') != null && resultTotal == 0) &&
      //               <h2>No results found for {searchParams.get('postcode')}.</h2>
      //             }
      //           </div>
      //         </div>
      //       }
      //       {(searchParams.get('postcode') != null && resultTotal > 0) &&
      //         <>
      //           <Text>{`Showing ${resultTotal} crimes for ${searchParams.get('postcode') as string}`}</Text>
      //           <CrimeRecords crimesList={crimesList} />
      //         </>
      //       }
      //     </div>
      //     <div className="flex-auto w-1/4 p-5 overflow-y-auto">
      //       <h3>Search history</h3>
      //       <History removeEntry={(e: any) => removeEntry(e)} entries={history} clearHistory={() => setHistory([])} updateParameters={(e: any) => handleSubmitHistory(e.postcode)} title={"history"} />
      //       <div>
      //       </div>
      //     </div>
      //   </div>
      // </main>
    //   <footer className="bg-gray-100 p-1 text-xs text-center">An SPA by Luke Rakowski</footer>
    // </div>
  );
}

export default App;