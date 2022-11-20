import fullyConnected from "../graphs/fullyConnected";
import GraphWithControls from "../react_components/GraphWithControls";

export default function Test() {
  return (
    <>
      <GraphWithControls graph={fullyConnected(6)} />
    </>
  );
}
