import { PointerEvent, useEffect, useState } from "react";
import styles from "../styles/Graph.module.scss";
import { Edge, Graph as GraphType } from "../types/graph";
import layoutGraph from "../utils/graph_layout/layoutGraph";
import renderEdges from "../utils/graph_layout/renderEdges";
import scaleGraph from "../utils/graph_layout/scaleGraph";
import Graph from "./Graph";

export type PartiallyRenderedNode = {
  x: number;
  y: number;
  color: string;
  size: number;
  subgraph?: PartiallyRenderedGraph;
};

export type RenderedNode = Omit<PartiallyRenderedNode, "subgraph"> & {
  subgraph?: RenderedGraph;
};

export interface RenderedEdge {
  left: number;
  top: number;
  width: number;
  transform: string;
}

/**
 * This represents a partially rendered graph: The nodes are rendered (contain
 * actual coordinates that will be used to position the elements), but the edges
 * are just indices into the nodes and don't contain any position-properties.
 */
export interface PartiallyRenderedGraph {
  /**
   * An array of positions for the nodes.
   */
  nodes: PartiallyRenderedNode[];

  /**
   * The indices of the source and target node that are connected by this edge
   */
  edges: Edge[];
}

/**
 * This represents all the information that is necessary to render a graph.
 * It contains information about things like the position of nodes. It
 * doesn't contain logical information that isn't necessary for rendering the
 * graph, like cluster information.
 */
export interface RenderedGraph {
  nodes: RenderedNode[];
  edges: RenderedEdge[];
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
