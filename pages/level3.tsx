import { randomCostGenerator } from "../graphs/edgeCostGenerators";
import tree from "../graphs/tree";
import GraphWithControls from "../react_components/GraphWithControls";

export default function Level3() {
  return (
    <>
      <GraphWithControls graph={randomCostGenerator(tree(27, 3))} />
    </>
  );
}
