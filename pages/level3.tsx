import { randomCostGenerator } from "../graphs/edgeCostGenerators";
import tree from "../graphs/tree";
import NonSSRGame from "../react_components/NonSSRGame";

export default function Level3() {
  return (
    <>
      <NonSSRGame graph={randomCostGenerator(tree(27, 3))} />
    </>
  );
}
