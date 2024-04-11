import { useEffect, useState } from "react";

function History(props: any) {
  const [history, setHistory] = useState(props.entries);

  useEffect(() => {
    setHistory(props.entries);
  }, [props]);

  return (
    <div>
      <button onClick={props.clearHistory}>Clear</button>
      {history && history.map((data: any, index: any) => (
        <><div><button onClick={() => props.removeEntry(index)}>x</button><span onClick={() => props.updateParameters({ "postcode": data.postcode })}>{data.postcode}</span><div><i>{data.time}</i></div></div></>
      ))}
    </div>
  );
}

export default History;