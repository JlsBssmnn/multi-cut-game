import dynamic from "next/dynamic";
import { Level } from "../graphs/fixedLevels/levelTypes";

// use no SSR for the graph renderer, because otherwise there is a
// problem, where the styles are different for the server and client
const LevelFrame = dynamic(
  () => import("./LevelFrame"),
  {
    ssr: false,
  }
);

export interface NonSSRLevelProps {
  level: Level;
}

export default function NonSSRLevel({ level }: NonSSRLevelProps) {
  const { graph, solution } = level;
  return <LevelFrame graph={graph} solution={solution} />;
}
