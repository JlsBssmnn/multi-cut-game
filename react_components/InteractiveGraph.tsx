import { Dispatch, PointerEvent, SetStateAction, useState } from "react";
import styles from "../styles/Graph.module.scss";
import { LogicalGraph } from "../types/graph";
import layoutGraph from "../utils/graph_layout/layoutGraph";
import renderGraph from "../utils/graph_layout/renderEdges";
import scaleGraph from "../utils/graph_layout/scaleGraph";
import PartialGraph from "../utils/graph_rendering/PartialGraph/PartialGraph";
import PartialGraphTheme from "../utils/graph_rendering/PartialGraphTheme";
import GraphVisualization from "./GraphVisualization";

export interface InteractiveGraphProps {
  width: number;
  height: number;
  nodeSize: number;
  logicalGraph: LogicalGraph;
  edgeThickness: number;
  graphTheme: PartialGraphTheme;
  emitGraphChange: Dispatch<SetStateAction<LogicalGraph>>;
}

/**
 * This component displays the given graph and enables interaction with it.
 * This mean that nodes can be dragged via the pointer and thus nodes can
 * be moved. If the move of a node denotes an action that changes the
 * clustering, this component will emit a signal to it's parent to inform
 * it of this change.
 */
export default function InteractiveGraph({
  width,
  height,
  nodeSize,
  logicalGraph,
  edgeThickness,
  graphTheme,
  emitGraphChange,
}: InteractiveGraphProps) {
  const [partialGraph, setPartialGraph] = useState<PartialGraph>(() => {
    const partialGraph = layoutGraph(logicalGraph, nodeSize, graphTheme);
    scaleGraph(partialGraph, width, height, nodeSize);
    partialGraph.emitGraphChange = emitGraphChange;
    return partialGraph;
  });

  const renderedGraph = renderGraph(partialGraph, edgeThickness);

  function pointerDown(event: PointerEvent) {
    event.preventDefault();
    const pointerPosition = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
    setPartialGraph((partialGraph) => partialGraph.nodeAt(pointerPosition));
  }

  function pointerMove(event: PointerEvent) {
    if (
      event.buttons === 1 &&
      (event.target as HTMLElement).id === "drag-area"
    ) {
      const pointerPosition = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      setPartialGraph((partialGraph) => partialGraph.moveNode(pointerPosition));
    }
  }

  function pointerUp() {
    partialGraph.sendAction();
  }

  return (
    <div
      className={`noTouchAction ${styles.graph}`}
      style={{
        width,
        height,
      }}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
    >
      <GraphVisualization
        graph={renderedGraph}
        draggedClusterID={partialGraph.dragEvent?.clusterNodeID}
      />
      <div
        id="drag-area"
        style={{ width, height }}
        className={styles.dragArea}
      ></div>
    </div>
  );
}
