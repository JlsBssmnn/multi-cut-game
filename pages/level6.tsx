import allLevels from "../graphs/fixedLevels/allLevels";
import NonSSRLevel from "../react_components/NonSSRLevel";

const level = allLevels.grid5x5;
export const keyword = level.keyword;

export default function Level6() {
  return <NonSSRLevel level={level} />;
}
