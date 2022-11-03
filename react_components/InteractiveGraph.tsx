import { PointerEvent, useEffect, useState } from "react";
import styles from "../styles/Graph.module.scss";
import { Graph as GraphType, PartiallyRenderedGraph } from "../types/graph";
import { clusterOffset } from "../utils/calculations/geometry";
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

export interface InteractiveGraphProps {
  width: number;
  height: number;
  nodeSize: number;
  graph: GraphType;
  removeNodeFromCluster: (nodeID: string) => void;
  moveNodeToCluster: (nodeID: string, group: number) => void;
  joinClusters: (group1: number, group2: number) => void;
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
  removeNodeFromCluster,
  moveNodeToCluster,
  joinClusters,
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
    if (draggedNode == null) return;

    const { cluster, clusterNode } = draggedNode;

    if (clusterNode === undefined) {
      // a cluster was moved
      const { x, y, size, id } = renderInfo.nodes[cluster];
      for (let i = 0; i < renderInfo.nodes.length; i++) {
        const {
          x: otherX,
          y: otherY,
          size: otherSize,
          id: otherID,
        } = renderInfo.nodes[i];
        if (
          i !== cluster &&
          Math.max(x, otherX) <= Math.min(x + size, otherX + otherSize) &&
          Math.max(y, otherY) <= Math.min(y + size, otherY + otherSize)
        ) {
          joinClusters(parseInt(id), parseInt(otherID));
          return;
        }
      }
    } else {
      // a node within a cluster was moved
      const clusterSize = renderInfo.nodes[cluster].size;
      const { x, y, id } =
        renderInfo.nodes[cluster].subgraph!.nodes[clusterNode];

      // the node is still inside the cluster
      if (x >= 0 && y >= 0 && x <= clusterSize && y <= clusterSize) return;

      // check for collision with clusters
      const absoluteX = x + renderInfo.nodes[cluster].x;
      const absoluteY = y + renderInfo.nodes[cluster].y;

      for (let i = 0; i < renderInfo.nodes.length; i++) {
        const {
          x: clusterX,
          y: clusterY,
          size: clusterSize,
          id: group,
        } = renderInfo.nodes[i];
        if (
          clusterX <= absoluteX &&
          clusterY <= absoluteY &&
          absoluteX <= clusterX + clusterSize &&
          absoluteY <= clusterY + clusterSize
        ) {
          moveNodeToCluster(id, parseInt(group));
          return;
        }
      }

      // node is already in a singleton, so reset it's position
      if (renderInfo.nodes[cluster].subgraph!.nodes.length < 2) {
        setRenderInfo((graph) => {
          const newGraph = { ...graph };
          const node = newGraph.nodes[cluster].subgraph!.nodes[clusterNode];
          const offset = clusterOffset(1, nodeSize);
          node.x = offset;
          node.y = offset;

          return newGraph;
        });
        return;
      }
      removeNodeFromCluster(id);
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
