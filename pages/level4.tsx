import allLevels from "../graphs/fixedLevels/allLevels";
import NonSSRGame from "../react_components/NonSSRGame";

const level = allLevels.grid4x4;
export const keyword = level.keyword;

export default function Level4() {
  const { graph, solution } = level;

  return <NonSSRGame graph={graph} solution={solution} />;
}
