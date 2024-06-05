import { Table } from "antd";

function CrimeTable(props: any) {

  const dataSource = props.data.map((crimeData: any, index: any) => {
    return { 
      key: index,
      postcode: crimeData.location.postcode, 
      month: crimeData.month,
      street: crimeData.location.street.name,
      status: (crimeData.outcome_status) ? crimeData.outcome_status.category : "Ongoing"
    }
  });

  const columns = [
    {
      title: 'Postcode',
      dataIndex: 'postcode',
      key: 'postcode',
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Street',
      dataIndex: 'street',
      key: 'street',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <Table dataSource={dataSource} columns={columns} />
  );
}

export default CrimeTable;