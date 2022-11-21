import { randomCostGenerator } from "../graphs/edgeCostGenerators";
import fullyConnected from "../graphs/fullyConnected";
import GraphWithControls from "../react_components/GraphWithControls";

export default function Level1() {
  return (
    <>
      <GraphWithControls graph={randomCostGenerator(fullyConnected(6))} />
    </>
  );
}
