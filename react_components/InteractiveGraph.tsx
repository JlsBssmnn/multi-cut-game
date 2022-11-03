import { PointerEvent, useEffect, useState } from "react";
import styles from "../styles/Graph.module.scss";
import { Point } from "../types/geometry";
import { Graph as GraphType } from "../types/graph";
import layoutGraph from "../utils/graph_layout/layoutGraph";
import renderEdges from "../utils/graph_layout/renderEdges";
import scaleGraph from "../utils/graph_layout/scaleGraph";
import PartiallyRenderedGraph from "../utils/graph_rendering/PartiallyRenderedGraph";
import { copyObject } from "../utils/utils";
import Graph from "./Graph";

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
  graph: GraphType;
  signalHandlers: SignalHandlers;
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
  graph,
  signalHandlers,
}: InteractiveGraphProps) {
  const [renderInfo, setRenderInfo] = useState<PartiallyRenderedGraph>(() => {
    const info = layoutGraph(graph, nodeSize);
    scaleGraph(info, width, height, nodeSize);
    return info;
  });

  useEffect(() => {
    const info = layoutGraph(graph, nodeSize);
    scaleGraph(info, width, height, nodeSize);
    setRenderInfo(info);
  }, [graph]);

  const [draggedNode, setDraggedNode] = useState<DraggedNode | null>(null);

  const { nodes, edges } = renderEdges(renderInfo);

  function pointerDown(event: PointerEvent) {
    event.preventDefault();
    const pointerPosition = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
    setDraggedNode(renderInfo.nodeAt(pointerPosition));
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
      setRenderInfo((info) => info.moveNode(pointerPosition, draggedNode));
    }
  }

  function pointerUp() {
    if (draggedNode == null) return;
    if (renderInfo.sendAction(draggedNode, signalHandlers) === "rerender") {
      setRenderInfo((info) => copyObject(info));
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
      <Graph graph={{ nodes, edges }} />
      <div
        id="drag-area"
        style={{ width, height }}
        className={styles.dragArea}
      ></div>
    </div>
  );
}
