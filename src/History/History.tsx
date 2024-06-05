import { useEffect, useState } from "react";
import { Button } from "antd";
import { Typography } from "antd";
import React from "react";

function History(props: any) {
  const [history, setHistory] = useState(props.entries);
  const { Text } = Typography;

  useEffect(() => {
    setHistory(props.entries);
  }, [props]);

  const renderHistory = history && history.map((data: any, index: any) => (
    <React.Fragment key={index}>
      <div className="truncate">
        <span className="cursor-pointer" onClick={() => props.updateParameters({ "postcode": data.postcode })}>{data.postcode}</span>
      </div>
      <div className="truncate"><small className={"timestamp-entry"}>{data.time}</small></div>
      <div className="ml-auto mr-0">
        <Button className="pr-0" onClick={() => props.removeEntry(index)} size="small" type="link" danger>
          Remove
        </Button>
      </div>
    </React.Fragment>
  ))

  return (
    <>
      <div className="z-10 p-5 flex items-center justify-between sticky bg-white top-0">
        <Text type="secondary">Your search history:</Text>
        <Button type="default" size="small" id={"clearHistoryBtn"} onClick={props.clearHistory} danger>Clear all</Button>
      </div>
      <div key="unique-key" className="items-center p-5 w-full inline-grid grid-cols-3-auto gap-2">
        {renderHistory}
      </div>
    </>
  );
}

export default History;