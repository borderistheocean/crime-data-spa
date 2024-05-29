import { Anchor } from "antd";
import { useEffect, useState } from "react";

function Navigation(props: any) {
  const [anchorData, setAnchorData] = useState([]);

  useEffect(() => {
    const crimes = props.crimesList.map((c: any, i: any) => {
      return { key: i.toString(), href: `#${c.type}`, title: c.type }
    }
    );
    setAnchorData(crimes);
  }, [props.crimesList]);

  return (
    <>
      <Anchor
        className="mt-5"
        targetOffset={75}
        affix={false}
        getContainer={() => document.getElementById("crimesContainer")!}
        items={anchorData}
      />
    </>
  );
}

export default Navigation;