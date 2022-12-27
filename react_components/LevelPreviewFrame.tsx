import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LogicalGraph } from "../types/graph";
import styles from "../styles/LevelGenerator.module.scss";
import gameToolStyles from "../styles/GameTools.module.scss";

import {
  appBarHeight,
  graphMargin,
  graphTheme,
  nodeSize,
} from "../utils/constants";
import { Paper } from "@mui/material";
import { useWindowSize } from "../utils/customHooks";
import { Solution } from "../utils/server_utils/findBestMulticut";
import { Layout } from "../utils/graph_layout/LayoutAlgorithms";
import { highlightedEdgeContext } from "./LevelFrame";
import PreviewGameControls from "./LevelGeneratorTools/PreviewGameControls";
import InteractiveGraphV2 from "./InteractiveGraphV2";

export interface LevelPreviewFrameProps {
  graph: LogicalGraph;
  setGraph: Dispatch<SetStateAction<LogicalGraph>>;
  solution?: Solution;
  layout: Layout;
}

export default function LevelPreviewFrame(props: LevelPreviewFrameProps) {
  const [highlightedEdge, setHighlightedEdge] = useState<string>("");
  const [graphKey, setGraphKey] = useState<number>(0);
  const [graph, setGraph] = useState<LogicalGraph>(
    JSON.parse(JSON.stringify(props.graph))
  );
  const [gameSuccessShown, setGameSuccessShown] = useState<boolean>(false);

  useEffect(() => {
    setGraph(JSON.parse(JSON.stringify(props.graph)));
    setGraphKey((prev) => prev + 1);
    setGameSuccessShown(false);
  }, [props.graph]);

  const [width, height] = useWindowSize();
  const margin = parseInt(styles.margin);
  const gap = parseInt(styles.flexGap);

  const gameToolHeight = parseFloat(gameToolStyles.containerMobileHeight) ?? 0;
  const graphHeight = height - appBarHeight - 2 * margin - gameToolHeight - gap;

  const controlsWidth = parseInt(styles.generatorControlsWidth);
  const graphWidth = width - controlsWidth - 2 * margin - gap;

  return (
    <highlightedEdgeContext.Provider
      value={{ highlightedEdge, setHighlightedEdge }}
    >
      <div className={styles.previewFrame}>
        <PreviewGameControls
          graph={graph}
          theme={graphTheme}
          solution={props.solution}
          layout={props.layout}
          width={graphWidth}
          height={graphHeight}
          gameSuccessShown={gameSuccessShown}
          setGameSuccessShown={setGameSuccessShown}
        />
        <Paper elevation={10} sx={{ width: graphWidth, height: graphHeight }}>
          {props.graph.nodes.length > 0 && (
            <InteractiveGraphV2
              key={graphKey}
              width={graphWidth}
              height={graphHeight}
              margin={graphMargin}
              nodeSize={nodeSize}
              logicalGraph={graph}
              graphTheme={graphTheme}
              emitGraphChange={setGraph}
              layout={props.layout}
            />
          )}
        </Paper>
      </div>
    </highlightedEdgeContext.Provider>
  );
}
