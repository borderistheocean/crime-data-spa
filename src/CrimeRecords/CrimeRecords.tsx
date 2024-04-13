import "./CrimeRecords.scss";

function CrimeRecords(props: any) {
  const crimeTables = props.crimesList.map((crimeData: any) => (
    <>
      {crimeData.map((crime: any) => (
        <>
          <h2 id={crime.type}>{crime.type}</h2>
          <table className={"crimesTable"}>
            <thead>
              <tr>
                <th>Postcode</th>
                <th>Month</th>
                <th>Street</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {crime.entries.map((details: any, index: any) => (
                <tr key={index}>
                  <td>{details.location.postcode}</td>
                  <td>{details.month}</td>
                  <td>{details.location.street.name}</td>
                  <td>{(details.outcome_status) ? details.outcome_status.category : "ongoing"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ))}
    </>
  )
  );

  return (
    <>{crimeTables}</>
  );
}

export default CrimeRecords;