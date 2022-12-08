import { PartialSubgraph } from "../../types/graph";
import { gridLayoutSpacing } from "../constants";
import PartialGraph from "../graph_rendering/PartialGraph/PartialGraph";

export function gridSubgraphLayout(
  graph: PartialGraph,
  subgraph: PartialSubgraph
): void {
  const n = Math.sqrt(
    graph.nodes.reduce((sum, cluster) => sum + cluster.subgraph.nodes.length, 0)
  );

  subgraph.nodes.forEach((node) => {
    node.x = node.id % n;
    node.y = Math.floor(node.id / n);
  });
}

export function gridClusterLayout(graph: PartialGraph): void {
  const n = Math.sqrt(
    graph.nodes.reduce((sum, cluster) => sum + cluster.subgraph.nodes.length, 0)
  );

  graph.nodes.forEach((clusterNode) => {
    clusterNode.x = clusterNode.id % n;
    clusterNode.y = Math.floor(clusterNode.id / n);
  });
}

export function computeSubgraphSize(
  graph: PartialGraph,
  subgraph: PartialSubgraph
): number {
  const n = Math.sqrt(
    graph.nodes.reduce((sum, cluster) => sum + cluster.subgraph.nodes.length, 0)
  );

  const xPositions = subgraph.nodes.map((node) => node.id % n);
  const yPositions = subgraph.nodes.map((node) => Math.floor(node.id / n));

  const stretch = Math.max(
    Math.max(...xPositions) - Math.min(...xPositions),
    Math.max(...yPositions) - Math.min(...yPositions)
  );

  return (
    stretch * (graph.nodeSize * gridLayoutSpacing) +
    (stretch + 1) * graph.nodeSize
  );
}
