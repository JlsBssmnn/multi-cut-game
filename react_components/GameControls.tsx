import { Paper } from "@mui/material";
import { forwardRef } from "react";
import styles from "../styles/GameTools.module.scss";
import { LogicalGraph } from "../types/graph";
import {
  getGraphFromSolution,
  getGraphScore,
} from "../utils/calculations/graphCalculations";
import { getUserDevice } from "../utils/cssUtils";
import { useWindowSize } from "../utils/customHooks";
import PartialGraphTheme from "../utils/graph_rendering/PartialGraphTheme";
import { Solution } from "../utils/server_utils/findBestMulticut";
import GameSuccess from "./GameTools/GameSuccess";
import GameToolWrapper from "./GameTools/GameToolWrapper";
import OptimalCost from "./GameTools/OptimalCost";
import OptimalMulticut from "./GameTools/OptimalMulticut";

export interface StatsProps {
  graph: LogicalGraph;
  theme: PartialGraphTheme;
  solution: Solution;
}

export default forwardRef<HTMLDivElement, StatsProps>(function GameControls(
  { graph, theme, solution },
  ref
) {
  const optimalMulticut = getGraphFromSolution(graph, solution);

  const [width, height] = useWindowSize();
  const userDevice = getUserDevice(width, height);

  const cost = getGraphScore(graph);

  return (
    <Paper elevation={10} className={styles.container} ref={ref}>
      <GameToolWrapper device={userDevice}>
        <div className={styles.currentCost}>
          Current cost:{" "}
          <span style={{ color: cost > 0 ? "red" : "green" }}>{cost}</span>
        </div>
        <OptimalCost optimalSolution={solution} />
        <OptimalMulticut optimalMulticut={optimalMulticut} theme={theme} />
        <GameSuccess currentCost={cost} optimalSolution={solution} />
      </GameToolWrapper>
    </Paper>
  );
});
