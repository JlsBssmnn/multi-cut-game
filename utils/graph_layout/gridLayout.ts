import { PartialSubgraph } from "../../types/graph";
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
