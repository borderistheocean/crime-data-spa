import "./Navigation.scss";

function Navigation(props: any) {
  const crimeNavigation = props.crimesList.map((crimeData: any, index: number) =>
    <ul id={"crimesNavigationList"} key={index.toString()}>
      {crimeData.map((c: any, i: any) => (
        <li key={i}><a href={`#${c.type}`}>{c.type}</a></li>
      ))}
    </ul>
  );

  return (
    <>
      {crimeNavigation}
    </>
  );
}

export default Navigation;