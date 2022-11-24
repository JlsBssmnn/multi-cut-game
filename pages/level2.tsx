import { randomCostGenerator } from "../graphs/edgeCostGenerators";
import gridGraph from "../graphs/grid";
import NonSSRGame from "../react_components/NonSSRGame";

export default function Level2() {
  return (
    <>
      <NonSSRGame graph={randomCostGenerator(gridGraph(4))} />
    </>
  );
}
