import { randomCostGenerator } from "../graphs/edgeCostGenerators";
import randomGraph from "../graphs/random";
import GraphWithControls from "../react_components/GraphWithControls";

export default function Level4() {
  return (
    <>
      <GraphWithControls graph={randomCostGenerator(randomGraph(20, 0.15))} />
    </>
  );
}
