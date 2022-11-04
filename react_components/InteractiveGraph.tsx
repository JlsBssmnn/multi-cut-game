import { PointerEvent, useEffect, useState } from "react";
import styles from "../styles/Graph.module.scss";
import { Point } from "../types/geometry";
import { LogicalGraph } from "../types/graph";
import layoutGraph from "../utils/graph_layout/layoutGraph";
import renderGraph from "../utils/graph_layout/renderEdges";
import scaleGraph from "../utils/graph_layout/scaleGraph";
import PartialGraph from "../utils/graph_rendering/PartialGraph";
import { copyObject } from "../utils/utils";
import GraphVisualization from "./GraphVisualization";

export interface DraggedNode {
  /**
   * The index of the cluster that is dragged.
   */
  clusterNode: number;

  /**
   * The distance from the dragged node's origin to the pointer.
   */
  pointerOffset: Point;

  /**
   * The index of the node in the cluster that is dragged. If no
   * node in the cluster but just the cluster is dragged this
   * is undefined.
   */
  node?: number;
}

export interface SignalHandlers {
  removeNodeFromCluster: (nodeID: string) => void;
  moveNodeToCluster: (nodeID: string, group: number) => void;
  joinClusters: (group1: number, group2: number) => void;
}

export interface InteractiveGraphProps {
  width: number;
  height: number;
  nodeSize: number;
  logicalGraph: LogicalGraph;
  signalHandlers: SignalHandlers;
  edgeThickness: number;
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
  signalHandlers,
  edgeThickness,
}: InteractiveGraphProps) {
  const [partialGraph, setPartialGraph] = useState<PartialGraph>(() => {
    const partialGraph = layoutGraph(logicalGraph, nodeSize);
    scaleGraph(partialGraph, width, height, nodeSize);
    return partialGraph;
  });

  useEffect(() => {
    const partialGraph = layoutGraph(logicalGraph, nodeSize);
    scaleGraph(partialGraph, width, height, nodeSize);
    setPartialGraph(partialGraph);
  }, [logicalGraph]);

  const [draggedNode, setDraggedNode] = useState<DraggedNode | null>(null);

  const renderedGraph = renderGraph(partialGraph, edgeThickness);

  function pointerDown(event: PointerEvent) {
    event.preventDefault();
    const pointerPosition = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
    setDraggedNode(partialGraph.nodeAt(pointerPosition));
  }

  function pointerMove(event: PointerEvent) {
    if (
      event.buttons === 1 &&
      draggedNode != null &&
      (event.target as HTMLElement).id === "drag-area"
    ) {
      const pointerPosition = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      setPartialGraph((partialGraph) =>
        partialGraph.moveNode(pointerPosition, draggedNode)
      );
    }
  }

  function pointerUp() {
    if (draggedNode == null) return;
    if (partialGraph.sendAction(draggedNode, signalHandlers) === "rerender") {
      setPartialGraph((info) => copyObject(info));
    }
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
      <GraphVisualization graph={renderedGraph} />
      <div
        id="drag-area"
        style={{ width, height }}
        className={styles.dragArea}
      ></div>
    </div>
  );
}
