import { PointerEvent, useEffect, useState } from "react";
import styles from "../styles/Graph.module.scss";
import { Graph as GraphType } from "../types/graph";
import layoutGraph from "../utils/graph_layout/layoutGraph";
import scaleLayout from "../utils/graph_layout/scaleLayout";

/**
 * This represents all the information that is necessary to render a graph.
 * It contains information about things like the position of nodes. It
 * doesn't contain logical information that isn't necessary for rendering the
 * graph, like cluster information.
 */
export interface GraphRenderInfo {
  /**
   * An array of positions for the nodes.
   */
  nodes: { x: number; y: number }[];

  /**
   * The indicies of the source and target node that are connected by this edge
   */
  edges: { source: number; target: number }[];
}

/**
 * This component renders a graph given the graph data. All nodes will have the
 * given `nodeSize` and the container div will have the specified `width` and
 * `height`.
 */
export default function GraphRenderer({
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
  const [renderInfo, setRenderInfo] = useState<GraphRenderInfo>(() => {
    const info = layoutGraph(graph);
    scaleLayout(info.nodes, width, height, nodeSize);
    return info;
  });

  useEffect(() => {
    const info = layoutGraph(graph);
    scaleLayout(info.nodes, width, height, nodeSize);
    setRenderInfo(info);
  }, [graph]);

  const [draggedNode, setDraggedNode] = useState<number | null>(null);
  const nodes = renderInfo.nodes;

  // compute the lines that connect the nodes
  const edges = renderInfo.edges.map((edge) => {
    const source = nodes[edge.source];
    const target = nodes[edge.target];
    const length = Math.sqrt(
      (source.x - target.x) ** 2 + (source.y - target.y) ** 2
    );
    var angle =
      Math.atan2(target.y - source.y, target.x - source.x) * (180 / Math.PI);

    return {
      left: source.x + nodeSize / 2,
      top: source.y + nodeSize / 2,
      width: length,
      transform: `rotate(${angle}deg)`,
    };
  });

  function pointerDown(event: PointerEvent) {
    event.preventDefault();
    const pointerX = event.nativeEvent.offsetX,
      pointerY = event.nativeEvent.offsetY;

    let hitNode = null;
    for (let i = 0; i < renderInfo.nodes.length; i++) {
      const { x, y } = nodes[i];
      if (
        x <= pointerX &&
        y <= pointerY &&
        pointerX <= x + nodeSize &&
        pointerY <= y + nodeSize
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

        nodes[draggedNode].x = Math.max(
          Math.min(pointerX - nodeSize / 2, width - nodeSize),
          0
        );
        nodes[draggedNode].y = Math.max(
          Math.min(pointerY - nodeSize / 2, height - nodeSize),
          0
        );

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
      className={"noTouchAction"}
      style={{
        width,
        height,
        position: "relative",
      }}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
    >
      <div>
        {edges.map((edge, i) => (
          <div key={i} className={styles.edge} style={edge}></div>
        ))}
      </div>
      <div>
        {nodes.map((node, i) => (
          <div
            key={i}
            className={styles.node}
            style={{
              left: node.x,
              top: node.y,
              height: nodeSize,
              width: nodeSize,
            }}
          ></div>
        ))}
      </div>
      <div
        style={{ position: "absolute", width, height, top: 0, left: 0 }}
        id="drag-area"
      ></div>
    </div>
  );
}
