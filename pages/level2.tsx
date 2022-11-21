import { randomCostGenerator } from "../graphs/edgeCostGenerators";
import gridGraph from "../graphs/grid";
import GraphWithControls from "../react_components/GraphWithControls";

export default function Level2() {
  return (
    <>
      <GraphWithControls graph={randomCostGenerator(gridGraph(4))} />
    </>
  );
}
