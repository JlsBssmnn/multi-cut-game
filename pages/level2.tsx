import allLevels from "../graphs/fixedLevels/allLevels";
import NonSSRLevel from "../react_components/NonSSRLevel";

const level = allLevels.fullyConnected7;
export const keyword = level.keyword;

export default function Level2() {
  return <NonSSRLevel level={level} />;
}
