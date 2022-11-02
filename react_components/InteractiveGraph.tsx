import { PointerEvent, useEffect, useState } from "react";
import styles from "../styles/Graph.module.scss";
import { Graph as GraphType, PartiallyRenderedGraph } from "../types/graph";
import layoutGraph from "../utils/graph_layout/layoutGraph";
import renderEdges from "../utils/graph_layout/renderEdges";
import scaleGraph from "../utils/graph_layout/scaleGraph";
import Graph from "./Graph";

/**
 * This component displays the given graph and enables interaction with it.
 * This mean that nodes can be dragged via the pointer and thus nodes can
 * be moved. If the move of a node denotes an action that changes the
 * clustering, this component will emit a signal to it's parent to inform
 * it of this change (TODO).
 */
export default function InteractiveGraph({
  width,
  height,
  nodeSize,
  graph,
}: {
  width: number;
  height: number;
  nodeSize: number;
  graph: GraphType;
}) {
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

  const [draggedNode, setDraggedNode] = useState<number | null>(null);

  const { nodes, edges } = renderEdges(renderInfo);

  function pointerDown(event: PointerEvent) {
    event.preventDefault();
    const pointerX = event.nativeEvent.offsetX,
      pointerY = event.nativeEvent.offsetY;

    let hitNode = null;
    for (let i = 0; i < renderInfo.nodes.length; i++) {
      const { x, y, size } = renderInfo.nodes[i];
      if (
        x <= pointerX &&
        y <= pointerY &&
        pointerX <= x + size &&
        pointerY <= y + size
      ) {
        hitNode = i;
        break;
      }
    }
    setDraggedNode(hitNode);
  }

  function pointerMove(event: PointerEvent) {
    if (
      event.buttons === 1 &&
      draggedNode != null &&
      (event.target as HTMLElement).id === "drag-area"
    ) {
      const pointerX = event.nativeEvent.offsetX,
        pointerY = event.nativeEvent.offsetY;
      setRenderInfo((info) => {
        const nodes = [...info.nodes];
        const edges = [...info.edges];

        nodes[draggedNode].x = pointerX - nodes[draggedNode].size / 2;
        nodes[draggedNode].y = pointerY - nodes[draggedNode].size / 2;

        return {
          nodes,
          edges,
        };
      });
    }
  }

  function pointerUp() {
    // setRecording(false);
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
