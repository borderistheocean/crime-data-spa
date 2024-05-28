import Title from "antd/es/typography/Title";
import CrimeTable from "../CrimeTable/CrimeTable";
import "./CrimeRecords.scss";

function CrimeRecords(props: any) {
  console.log(props);
  const crimeTables = props.crimesList.map((crimeData: any) => (
    <>
      <div id={crimeData.type}>
        <Title level={3}>{crimeData.type}</Title>
        <CrimeTable data={crimeData.entries} />
      </div>
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