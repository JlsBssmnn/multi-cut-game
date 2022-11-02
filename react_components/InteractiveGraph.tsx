import { PointerEvent, useEffect, useState } from "react";
import styles from "../styles/Graph.module.scss";
import { Graph as GraphType, PartiallyRenderedGraph } from "../types/graph";
import layoutGraph from "../utils/graph_layout/layoutGraph";
import renderEdges from "../utils/graph_layout/renderEdges";
import scaleGraph from "../utils/graph_layout/scaleGraph";
import Graph from "./Graph";

interface DraggedNode {
  /**
   * The index of the cluster that is dragged.
   */
  cluster: number;

  /**
   * The distance on the x-axis from the dragged node's origin
   * to the pointer.
   */
  pointerOffsetX: number;

  /**
   * The distance on the y-axis from the dragged node's origin
   * to the pointer.
   */
  pointerOffsetY: number;

  /**
   * The index of the node in the cluster that is dragged. If no
   * node in the cluster but just the cluster is dragged this
   * is undefined.
   */
  clusterNode?: number;
}

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

  const [draggedNode, setDraggedNode] = useState<DraggedNode | null>(null);

  const { nodes, edges } = renderEdges(renderInfo);

  function pointerDown(event: PointerEvent) {
    event.preventDefault();
    const pointerX = event.nativeEvent.offsetX,
      pointerY = event.nativeEvent.offsetY;

    let cluster = null;
    let clusterNode;

    // check for collision with clusters
    for (let i = 0; i < renderInfo.nodes.length; i++) {
      const { x, y, size } = renderInfo.nodes[i];
      if (
        x <= pointerX &&
        y <= pointerY &&
        pointerX <= x + size &&
        pointerY <= y + size
      ) {
        cluster = i;
        const subgraph = renderInfo.nodes[i].subgraph;
        if (!subgraph) break;

        // check for collision with nodes inside the cluster
        for (let j = 0; j < subgraph.nodes.length; j++) {
          let { x: clusterNodeX, y: clusterNodeY, size } = subgraph.nodes[j];
          clusterNodeX += x;
          clusterNodeY += y;

          if (
            clusterNodeX <= pointerX &&
            clusterNodeY <= pointerY &&
            pointerX <= clusterNodeX + size &&
            pointerY <= clusterNodeY + size
          ) {
            clusterNode = j;
            break;
          }
        }
        break;
      }
    }

    if (cluster === null) {
      setDraggedNode(cluster);
      return;
    }
    const nodeX =
      typeof clusterNode === "undefined"
        ? renderInfo.nodes[cluster].x
        : renderInfo.nodes[cluster].subgraph!.nodes[clusterNode].x;
    const nodeY =
      typeof clusterNode === "undefined"
        ? renderInfo.nodes[cluster].y
        : renderInfo.nodes[cluster].subgraph!.nodes[clusterNode].y;

    const pointerOffsetX = pointerX - nodeX;
    const pointerOffsetY = pointerY - nodeY;

    setDraggedNode({
      cluster,
      pointerOffsetX,
      pointerOffsetY,
      clusterNode,
    });
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

        const { cluster, pointerOffsetX, pointerOffsetY, clusterNode } =
          draggedNode;

        if (clusterNode === undefined) {
          nodes[cluster].x = pointerX - pointerOffsetX;
          nodes[cluster].y = pointerY - pointerOffsetY;
        } else {
          nodes[cluster].subgraph!.nodes[clusterNode].x =
            pointerX - pointerOffsetX;
          nodes[cluster].subgraph!.nodes[clusterNode].y =
            pointerY - pointerOffsetY;
        }

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
