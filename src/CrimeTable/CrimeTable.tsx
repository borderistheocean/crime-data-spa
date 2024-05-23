import { Table } from "antd";

function CrimeTable(props: any) {

  const dataSource = props.data.map((element: any, index: any) => {
    return { 
      key: index,
      postcode: element.location.postcode, 
      month: element.month,
      street: element.location.street.name,
      status: (element.outcome_status) ? element.outcome_status.category : "ongoing"
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