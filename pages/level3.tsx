import allLevels from "../graphs/fixedLevels/allLevels";
import NonSSRLevel from "../react_components/NonSSRLevel";

const level = allLevels.random20;
export const keyword = level.keyword;

export default function Level3() {
  return <NonSSRLevel level={level} />;
}
