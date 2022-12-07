import allLevels from "../graphs/fixedLevels/allLevels";
import NonSSRLevel from "../react_components/NonSSRLevel";

const level = allLevels.fullyConnected12;
export const keyword = level.keyword;

export default function Level5() {
  return <NonSSRLevel level={level} />;
}
