import "./Map.scss";

function Map(props: any) {
  return (
    <div className="m-5">
      <img className="rounded-md" id="mapPlaceholder" alt="Map of the UK" src="./map.webp"></img>
    </div>
  );
}

export default Map;