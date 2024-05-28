import Title from "antd/es/typography/Title";
import CrimeTable from "../CrimeTable/CrimeTable";

function CrimeRecords(props: any) {
  const crimeTables = props.crimesList.map((crimeData: any) => (
    <div className="m-5" id={crimeData.type}>
      <Title level={3}>{crimeData.type}</Title>
      <CrimeTable data={crimeData.entries} />
    </div>
  )
  );

  return (
    <>
      <>{crimeTables}</>
    </>
  );
}

export default CrimeRecords;