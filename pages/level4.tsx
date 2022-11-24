import { randomCostGenerator } from "../graphs/edgeCostGenerators";
import randomGraph from "../graphs/random";
import NonSSRGame from "../react_components/NonSSRGame";

export default function Level4() {
  return (
    <>
      <NonSSRGame graph={randomCostGenerator(randomGraph(20, 0.15))} />
    </>
  );
}
