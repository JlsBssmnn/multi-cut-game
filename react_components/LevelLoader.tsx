import { useEffect, useState } from "react";
import ImportButton from "./LevelImportTools/ImportButton";
import { Level } from "../graphs/fixedLevels/levelTypes";
import LevelFrame from "./LevelFrame";
import { LayoutAlgorithms } from "../utils/graph_layout/LayoutAlgorithms";

export default function LevelLoader() {
  const [level, setLevel] = useState<Level>();

  useEffect(() => {
    if (!level) return;

    const computeSolution = async () => {
      const response = await fetch("/api/bestMulticut", {
        method: "POST",
        body: JSON.stringify(level.graph.edges),
      });
      const solution = await response.json();
      setLevel((level) => {
        if (!level) return level;
        level.solution = solution;
        return { ...level };
      });
    };
    if (level && level.solution.cost === 1) {
      computeSolution();
    }
  }, [level]);

  return (
    <>
      <ImportButton setLevel={setLevel} />
      {level && (
        <LevelFrame
          graph={level.graph}
          solution={level.solution.cost === 1 ? null : level.solution}
          layout={level.layout ?? LayoutAlgorithms.force}
        />
      )}
    </>
  );
}
