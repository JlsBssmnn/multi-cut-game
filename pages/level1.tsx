import { randomCostGenerator } from "../graphs/edgeCostGenerators";
import fullyConnected from "../graphs/fullyConnected";
import NonSSRGame from "../react_components/NonSSRGame";

export default function Level1() {
  return (
    <>
      <NonSSRGame graph={randomCostGenerator(fullyConnected(6))} />
    </>
  );
}
