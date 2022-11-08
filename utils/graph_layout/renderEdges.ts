import { Graph, ClusterNode, PartialSubgraph } from "../../types/graph";
import PartialGraph from "../graph_rendering/PartialGraph/PartialGraph";

/**
 * This function takes a partially rendered graph and renders the edges of that
 * graph. This is done by computing the a line between every pair of nodes that
 * are connected by an edge. The result of this function is a fully rendered graph.
 */
export default function renderEdges(
  graph: PartialGraph | PartialSubgraph,
  edgeThickness: number
): Graph {
  const nodes = graph.nodes.map((node) => {
    if ("subgraph" in node)
      return { ...node, subgraph: renderEdges(node.subgraph, edgeThickness) };
    else return node as ClusterNode;
  });

  const edges = graph.edges.map((edge) => {
    let {
      x: sourceX,
      y: sourceY,
      size: sourceSize,
    } = graph.nodes.find((node) => node.id === edge.source)!;
    let {
      x: targetX,
      y: targetY,
      size: targetSize,
    } = graph.nodes.find((node) => node.id === edge.target)!;

    sourceX += sourceSize / 2;
    sourceY += sourceSize / 2;
    targetX += targetSize / 2;
    targetY += targetSize / 2;

    const length = Math.sqrt(
      (sourceX - targetX) ** 2 + (sourceY - targetY) ** 2
    );
    var angle =
      Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI);

    return {
      left: sourceX,
      top: sourceY,
      width: length,
      height: computeEdgeThickness(edgeThickness, edge.value),
      backgroundColor: edge.value < 0 ? "red" : "green",
      transform: `rotate(${angle}deg)`,
      opacity: edge.opacity,
    };
  });

  return {
    nodes,
    edges,
  };
}

/**
 * This function computes the thickness of a rendered edge in pixels
 * depending on it's value by using the provided `edgeThickness` parameter.
 */
function computeEdgeThickness(edgeThickness: number, value: number): number {
  return Math.sqrt(edgeThickness * Math.abs(value));
}
