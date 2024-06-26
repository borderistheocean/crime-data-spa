import { useEffect, useState } from "react";
import { Button, Col, Row } from "antd";
import { Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function History(props: any) {
  const [history, setHistory] = useState(props.entries);
  const { Text } = Typography;

  useEffect(() => {
    setHistory(props.entries);
  }, [props]);

  const renderHistory = history && history.map((data: any, index: any) => (
    <Row key={index} className="h-8 [&:not(:last-child)]:border-b-1 border-gray-200" data-testid={index.toString().concat(data.postcode)}>
      <Col span={6} className="truncate self-center leading-normal cursor-pointer" onClick={() => props.updateParameters({ "postcode": data.postcode })}>
        {data.postcode}
      </Col>
      <Col span={12} className="truncate self-center leading-normal text-gray-400">{data.time}</Col>
      <Col span={6} className="truncate self-center">
        <Button icon={<DeleteOutlined />} className="mr-0 ml-auto block leading-normal float-end" onClick={() => props.removeEntry(index)} size="small" type="link" danger></Button>
      </Col>
    </Row>
  ))

  return (
    <>
      <div className="z-10 m-5 flex items-center justify-between sticky bg-white top-0">
        <Text type="secondary">Your search history:</Text>
        <Button disabled={(history.length === 0 ? true : false)} type="default" size="small" id={"clearHistoryBtn"} onClick={props.clearHistory} danger>Clear all</Button>
      </div>
      <div className="m-5">
        {renderHistory}
      </div>
    </>
  );
}

export default History;