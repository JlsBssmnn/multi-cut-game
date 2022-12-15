import { Paper } from "@mui/material";
import { LogicalGraph } from "../../types/graph";
import {
  getGraphFromSolution,
  getGraphScore,
} from "../../utils/calculations/graphCalculations";
import { Layout } from "../../utils/graph_layout/LayoutAlgorithms";
import PartialGraphTheme from "../../utils/graph_rendering/PartialGraphTheme";
import { Solution } from "../../utils/server_utils/findBestMulticut";
import styles from "../../styles/LevelGenerator.module.scss";
import gameToolStyles from "../../styles/GameTools.module.scss";
import OptimalCost from "../GameTools/OptimalCost";
import ShowHint from "../GameTools/ShowHint";
import OptimalMulticut from "../GameTools/OptimalMulticut";
import GameSuccess from "../GameTools/GameSuccess";

export interface PreviewGameControlsProps {
  graph: LogicalGraph;
  theme: PartialGraphTheme;
  solution?: Solution;
  layout: Layout;
}

export default function PreviewGameControls({
  graph,
  theme,
  solution,
  layout,
}: PreviewGameControlsProps) {
  const cost = getGraphScore(graph);

  return (
    <Paper elevation={10} className={styles.gameActionsContainer}>
      <div className={gameToolStyles.currentCost}>
        Current cost:{" "}
        <span style={{ color: cost > 0 ? "red" : "green" }}>{cost}</span>
      </div>
      {solution && (
        <>
          <OptimalCost optimalSolution={solution} />
          <ShowHint graph={graph} optimalSolution={solution} />
          <OptimalMulticut
            optimalMulticut={getGraphFromSolution(graph, solution)}
            theme={theme}
            layout={layout}
          />
          <GameSuccess currentCost={cost} optimalSolution={solution} />
        </>
      )}
    </Paper>
  );
}
