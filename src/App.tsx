import { useEffect, useRef, useState } from "react";
import { postcodeValidator } from "postcode-validator";
import { useSearchParams } from "react-router-dom";
import _ from "lodash";
import History from "./History/History";
import date from 'date-and-time';
import Navigation from "./Navigation/Navigation";
import Map from "./Map/Map";
import CrimeRecords from "./CrimeRecords/CrimeRecords";
import { Layout, Space, Typography, Input } from 'antd';
import "./App.scss";

function App() {
  const locale = "GB";
  const [postcodeInputValue, setpostcodeInputValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams("");
  const [crimesList, setCrimesList] = useState([] as any);
  const storedhistory = JSON.parse(localStorage.getItem("history") || "[]");
  const [history, setHistory] = useState(storedhistory);
  const [resultTotal, setResultTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const previousInputValue = useRef("");
  const { Text, Link } = Typography;
  const { Search } = Input;
  const { Sider, Content, Header } = Layout;

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
      setIsFetching(true);
      setCrimesList([]);
      setResultTotal(0);
      setHistory((history: any) => [{ "postcode": searchQuery, "time": timeAndDateNow }, ...history]);
      (async () => {
        const filterValidPostcodes = searchQuery.split(",").filter((postcode) => postcodeValidator(stripWhitespace(postcode), locale))

        if (filterValidPostcodes.length > 0) {
          const postCodeSearchRequests = filterValidPostcodes.map((x) => `https://api.getthedata.com/postcode/${stripWhitespace(x)}`)
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

                  setIsFetching(false);
                  setCrimesList(chained);
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
        } else {
          setIsFetching(false);
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
      setResultTotal(0);
    }

    setHistory(newHistory);
  };

  return (
    <>
      <div>
        <Layout className="h-screen w-screen">
          <Header>
            <Typography.Title
              level={4}
              style={{
                margin: 0,
              }}
            >Crime Data SPA</Typography.Title>
            <Space direction="vertical">
              <Search
                id={"postCodeSearchInput"}
                placeholder="Enter one or more postcodes"
                onChange={e => setpostcodeInputValue(e.target.value)}
                value={postcodeInputValue}
                onSearch={() => handleSubmit(postcodeInputValue)}
                onPressEnter={() => handleSubmit(postcodeInputValue)}
                style={{
                  width: 250
                }}
              />
            </Space>
          </Header>
          <Layout>
            <Sider
              width={"15%"}>
              <div className="flex h-full">
                <div className="flex justify-between flex-col overflow-y-auto scrollbar-thin scrollbar-webkit">
                  {(resultTotal !== 0) &&
                    <>
                      <Navigation crimesList={crimesList} />
                      <Map />
                    </>
                  }
                </div>
              </div>
            </Sider>
            <Content>
              <div className="flex h-full">
                <div id="crimesContainer" className="flex-auto w-3/4 overflow-y-auto bg-white scrollbar-thin scrollbar-webkit mx-5">
                  {(resultTotal === 0) &&
                    <div className="flex items-center justify-center w-full h-full">
                      <div>
                        {/*
                          If no postcode is entered display a message
                        */}
                        {(!searchParams.get('postcode') || (searchParams.get('postcode') && searchParams.get('postcode') === "")) &&
                          <span>Enter postcode(s) to search for crimes, entries such as <Link onClick={() => setSearchParams({ "postcode": "B46QB" })}>B46QB</Link> and <Link onClick={() => setSearchParams({ "postcode": "LE11AA" })}>LE11AA</Link> usually yield good amounts of crime data.</span>
                        }
                        {/*
                          If a postcode is entered but no results are found
                        */}
                        {(searchParams.get('postcode') && searchParams.get('postcode') !== "" && resultTotal === 0 && !isFetching) &&
                          <span>No results found for {searchParams.get('postcode')}.</span>
                        }
                      </div>
                    </div>
                  }
                  {/*
                    If postcode parameter is returning results
                  */}
                  {(searchParams.get('postcode') && resultTotal > 0) &&
                    <>
                      <div className="sticky top-0 z-10 min-w-full flex items-center p-5 bg-white">
                        <Text>{`Showing ${resultTotal} crimes for ${searchParams.get('postcode') as string}`}</Text>
                      </div>
                      <CrimeRecords crimesList={crimesList} />
                    </>
                  }
                </div>
                <div className="flex-auto w-1/4 overflow-y-auto scrollbar-thin scrollbar-webkit">
                  <History removeEntry={(e: any) => removeEntry(e)} entries={history} clearHistory={() => { setHistory([]); setResultTotal(0); setSearchParams({ "postcode": "" }) }} updateParameters={(e: any) => handleSubmitHistory(e.postcode)} title={"history"} />
                  <div>
                  </div>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </>
  );
}

export default App;