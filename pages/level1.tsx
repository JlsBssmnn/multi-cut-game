import allLevels from "../graphs/fixedLevels/allLevels";
import NonSSRLevel from "../react_components/NonSSRLevel";

const level = allLevels.tree27x3;
export const keyword = level.keyword;

export default function Level1() {
  return <NonSSRLevel level={level} />;
}
