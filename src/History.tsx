import { useEffect, useState } from "react";

function History(props: any) {
  const [history, setHistory] = useState(props.entries);

  useEffect(() => {
    setHistory(props.entries);
  }, [props]);

  return (
    <div>
      <button onClick={props.clearHistory}>Clear</button>
      {history && history.filter((entry: any) => typeof entry === "string").map((details: any, index: any) => (
        <><div><button onClick={() => props.removeEntry(index)}>x</button><span onClick={() => props.updateParameters({ "postcode": details })}>{details}</span></div></>
      ))}
    </div>
  );
}

export default History;