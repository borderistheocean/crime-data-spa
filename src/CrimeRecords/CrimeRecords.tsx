import Title from "antd/es/typography/Title";
import CrimeTable from "../CrimeTable/CrimeTable";
import "./CrimeRecords.scss";

function CrimeRecords(props: any) {
  const crimeTables = props.crimesList.map((crimeData: any) => (
    <>
      {crimeData.map((crime: any) => (
        <>
          <Title level={3} id={crime.type}>{crime.type}</Title>
          <CrimeTable data={crime.entries} />
        </>
      ))}
    </>
  )
  );

  return (
    <>
      <>{crimeTables}</>
    </>
  );
}

export default CrimeRecords;