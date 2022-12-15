import { createContext, Dispatch, useState } from "react";
import { LogicalGraph } from "../types/graph";
import styles from "../styles/Game.module.scss";
import gameToolStyles from "../styles/GameTools.module.scss";

import {
  appBarHeight,
  graphMargin,
  graphTheme,
  nodeSize,
} from "../utils/constants";
import { Paper } from "@mui/material";
import GameControls from "./GameControls";
import InteractiveGraph from "./InteractiveGraph";
import { useWindowSize } from "../utils/customHooks";
import { getUserDevice } from "../utils/cssUtils";
import { Solution } from "../utils/server_utils/findBestMulticut";
import { Layout } from "../utils/graph_layout/LayoutAlgorithms";

export interface LevelFrameProps {
  graph: LogicalGraph;
  solution: Solution | null;
  layout: Layout;
}

interface HighlightedEdgeContextState {
  highlightedEdge: string;
  setHighlightedEdge: Dispatch<any>;
}
export const highlightedEdgeContext =
  createContext<HighlightedEdgeContextState | null>(null);

export default function LevelFrame(props: LevelFrameProps) {
  const [graph, setGraph] = useState<LogicalGraph>(
    structuredClone(props.graph)
  );
  const [highlightedEdge, setHighlightedEdge] = useState<string>("");

  const [width, height] = useWindowSize();
  const userDevice = getUserDevice(width, height);
  const margin = parseInt(styles.topMargin);
  const gap = parseInt(styles.flexGap);

  // The height of the game tools which is relevant for the height of the
  // interactive graph (which depends on the current screen size)
  const gameToolHeight =
    userDevice !== "desktop"
      ? parseFloat(gameToolStyles.containerMobileHeight) ?? 0
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
    <highlightedEdgeContext.Provider
      value={{ highlightedEdge, setHighlightedEdge }}
    >
      <div className={styles.container}>
        <GameControls
          graph={graph}
          theme={graphTheme}
          solution={props.solution}
          layout={props.layout}
        />
        <Paper elevation={10}>
          <InteractiveGraph
            width={graphWidth}
            height={graphHeight}
            margin={graphMargin}
            nodeSize={nodeSize}
            logicalGraph={graph}
            graphTheme={graphTheme}
            emitGraphChange={setGraph}
            layout={props.layout}
          />
        </Paper>
      </div>
    </highlightedEdgeContext.Provider>
  );
}
