import { RenderedGraph, RenderedNode } from "../../types/graph";
import PartiallyRenderedGraph from "../graph_rendering/PartiallyRenderedGraph";

/**
 * This function takes a partially rendered graph and renders the edges of that
 * graph. This is done by computing the a line between every pair of nodes that
 * are connected by an edge. The result of this function is a fully rendered graph.
 */
export default function renderEdges(
  renderInfo: PartiallyRenderedGraph
): RenderedGraph {
  const nodes = renderInfo.nodes.map((node) => {
    if (!node.subgraph) return node as RenderedNode;
    else return { ...node, subgraph: renderEdges(node.subgraph) };
  });

  const edges = renderInfo.edges.map((edge) => {
    let {
      x: sourceX,
      y: sourceY,
      size: sourceSize,
    } = renderInfo.nodes[parseInt(edge.source)];
    let {
      x: targetX,
      y: targetY,
      size: targetSize,
    } = renderInfo.nodes[parseInt(edge.target)];

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
      transform: `rotate(${angle}deg)`,
    };
  });

  return {
    nodes,
    edges,
  };
}
