import { useEffect, useState } from "react";
import "./History.scss";

function History(props: any) {
  const [history, setHistory] = useState(props.entries);

  useEffect(() => {
    setHistory(props.entries);
  }, [props]);

  const renderHistory = history && history.map((data: any, index: any) => (
    <tr className={"history-entry"}>
      <td><span className={"postcode-entry"} onClick={() => props.updateParameters({ "postcode": data.postcode })}>{data.postcode}</span></td>
      <td><span className={"timestamp-entry"}>{data.time}</span></td>
      <td><small className={"remove-entry"} onClick={() => props.removeEntry(index)}>Remove</small></td>
    </tr>
  ))

  return (
    <div id={"searchHistoryEntries"}>
      <button id={"clearHistoryBtn"} onClick={props.clearHistory}>Clear</button>
      <table>
        {renderHistory}
      </table>
    </div>
  );
}

export default History;