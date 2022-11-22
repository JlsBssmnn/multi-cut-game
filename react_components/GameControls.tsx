import { useEffect, useState } from "react";
import styles from "../styles/GameTools.module.scss";
import { LogicalGraph } from "../types/graph";
import {
  getGraphFromSolution,
  getGraphScore,
} from "../utils/calculations/graphCalculations";
import PartialGraphTheme from "../utils/graph_rendering/PartialGraphTheme";
import { Solution } from "../utils/server_utils/findBestMulticut";
import GameSuccess from "./GameTools/GameSuccess";
import OptimalCost from "./GameTools/OptimalCost";
import OptimalMulticut from "./GameTools/OptimalMulticut";

export interface StatsProps {
  graph: LogicalGraph;
  theme: PartialGraphTheme;
}

export default function GameControls({ graph, theme }: StatsProps) {
  const [optimalSolution, setOptimalSolution] = useState<Solution | null>(null);
  const [optimalMulticut, setOptimalMulticut] = useState<LogicalGraph | null>(
    null
  );

  async function getOptimalSolution() {
    const response = await fetch("/api/bestMulticut", {
      method: "POST",
      body: JSON.stringify(graph.edges),
    });
    const solution: Solution = await response.json();
    setOptimalSolution(solution);
    setOptimalMulticut(getGraphFromSolution(graph, solution));
  }
  useEffect(() => {
    getOptimalSolution();
  }, []);

  const cost = getGraphScore(graph);

  return (
    <>
      <div className={styles.container}>
        <div>
          Current multicut cost:{" "}
          <span style={{ color: cost > 0 ? "red" : "green" }}>{cost}</span>
        </div>
        <OptimalMulticut optimalMulticut={optimalMulticut} theme={theme} />
        <OptimalCost optimalSolution={optimalSolution} />
        <GameSuccess currentCost={cost} optimalSolution={optimalSolution} />
      </div>
      <br />
    </>
  );
}
