import { Typography } from "antd";
import CrimeTable from "../CrimeTable/CrimeTable";
import React from "react";

function CrimeRecords(props: any) {

  const { Title } = Typography;
  const crimeTables = props.crimesList.map((crimeData: any, index: any) => (
      <div key={index} className="m-5" id={crimeData.type}>
        <Title level={3}>{crimeData.type}</Title>
        <CrimeTable data={crimeData.entries} />
      </div>
  ));

  return (
    <React.Fragment key={"crimeRecords"}>
      {crimeTables}
    </React.Fragment>
  );
}

export default CrimeRecords;