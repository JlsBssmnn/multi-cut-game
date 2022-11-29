import { useRef, useState } from "react";
import { LogicalGraph } from "../types/graph";
import styles from "../styles/Game.module.scss";
import gameToolStyles from "../styles/GameTools.module.scss";

import { appBarHeight, graphTheme } from "../utils/constants";
import { Paper } from "@mui/material";
import GameControls from "./GameControls";
import InteractiveGraph from "./InteractiveGraph";
import { useWindowSize } from "../utils/customHooks";
import { getUserDevice } from "../utils/cssUtils";
import { Solution } from "../utils/server_utils/findBestMulticut";

export interface GraphWithControlsProps {
  graph: LogicalGraph;
  solution?: Solution;
}

export default function GraphWithControls(props: GraphWithControlsProps) {
  const [graph, setGraph] = useState<LogicalGraph>(props.graph);
  const gameControls = useRef<HTMLDivElement | null>(null);

  const [width, height] = useWindowSize();
  const userDevice = getUserDevice(width, height);
  const margin = parseInt(styles.topMargin);
  const gap = parseInt(styles.flexGap);

  // The height of the game tools which is relevant for the height of the
  // interactive graph (which depends on the current screen size)
  const gameToolHeight =
    userDevice !== "desktop"
      ? gameControls.current?.getBoundingClientRect().height ?? 0
      : 0;
  const graphHeight = height - appBarHeight - 2 * margin - gameToolHeight - gap;

  // The width of the game tools which is relevant for the height of the
  // interactive graph (which depends on the current screen size)
  const gameToolWidth =
    userDevice === "desktop"
      ? parseInt(gameToolStyles.containerDesktopWidth) ?? 0
      : 0;
  const graphWidth = width - gameToolWidth - 2 * margin - gap;

  return (
    <div className={styles.container}>
      <GameControls
        graph={graph}
        theme={graphTheme}
        ref={gameControls}
        solution={props.solution}
      />
      <Paper elevation={10}>
        <InteractiveGraph
          width={graphWidth}
          height={graphHeight}
          margin={20}
          nodeSize={30}
          logicalGraph={graph}
          edgeThickness={6}
          graphTheme={graphTheme}
          emitGraphChange={setGraph}
        />
      </Paper>
    </div>
  );
}
