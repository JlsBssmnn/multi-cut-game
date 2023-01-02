import allLevels from "../graphs/fixedLevels/allLevels";
import NonSSRLevel from "../react_components/NonSSRLevel";

const level = allLevels.fullyConnected16;
export const keyword = level.keyword;

export default function Level7() {
  return <NonSSRLevel level={level} />;
}
