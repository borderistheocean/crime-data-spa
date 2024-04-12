import { useEffect, useState } from "react";

function History(props: any) {
  const [history, setHistory] = useState(props.entries);

  useEffect(() => {
    setHistory(props.entries);
  }, [props]);

  return (
    <div>
      <button style={{ marginBottom: "10px" }} onClick={props.clearHistory}>Clear</button>
      {history && history.map((data: any, index: any) => (
        <><div style={{ marginBottom: "5px" }}><span style={{ color: "#1171bc", cursor: "pointer", marginRight: "10px" }} onClick={() => props.removeEntry(index)}>x</span><span onClick={() => props.updateParameters({ "postcode": data.postcode })}>{data.postcode}</span><div><i>{data.time}</i></div></div></>
      ))}
    </div>
  );
}

export default History;