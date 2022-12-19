import { Paper } from "@mui/material";
import { forwardRef, useState } from "react";
import styles from "../styles/GameTools.module.scss";
import { LogicalGraph } from "../types/graph";
import {
  getGraphFromSolution,
  getGraphScore,
} from "../utils/calculations/graphCalculations";
import { getUserDevice } from "../utils/cssUtils";
import { useWindowSize } from "../utils/customHooks";
import { Layout } from "../utils/graph_layout/LayoutAlgorithms";
import PartialGraphTheme from "../utils/graph_rendering/PartialGraphTheme";
import { Solution } from "../utils/server_utils/findBestMulticut";
import GameSuccess from "./GameTools/GameSuccess";
import GameToolWrapper from "./GameTools/GameToolWrapper";
import OptimalCost from "./GameTools/OptimalCost";
import OptimalMulticut from "./GameTools/OptimalMulticut";
import ShowHint from "./GameTools/ShowHint";

export interface StatsProps {
  graph: LogicalGraph;
  theme: PartialGraphTheme;
  solution: Solution | null;
  layout: Layout;
}

export default forwardRef<HTMLDivElement, StatsProps>(function GameControls(
  { graph, theme, solution, layout },
  ref
) {
  const [gameSuccessShown, setGameSuccessShown] = useState<boolean>(false);

  const optimalMulticut = solution
    ? getGraphFromSolution(graph, solution)
    : null;

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
        <ShowHint graph={graph} optimalSolution={solution} />
        <OptimalMulticut
          optimalMulticut={optimalMulticut}
          theme={theme}
          layout={layout}
        />
        <GameSuccess
          setDialogShown={setGameSuccessShown}
          shouldOpen={
            !gameSuccessShown && solution != null && solution.cost === cost
          }
        />
      </GameToolWrapper>
    </Paper>
  );
});
