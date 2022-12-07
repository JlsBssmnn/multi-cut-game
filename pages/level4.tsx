import allLevels from "../graphs/fixedLevels/allLevels";
import NonSSRLevel from "../react_components/NonSSRLevel";

const level = allLevels.grid4x4;
export const keyword = level.keyword;

export default function Level4() {
  return <NonSSRLevel level={level} />;
}
