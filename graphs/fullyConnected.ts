import { LogicalGraph } from "../types/graph";

export default function fullyConnected(numOfNodes: number): LogicalGraph {
  const nodes = Array.from(Array(numOfNodes).keys()).map((i) => ({
    id: String(i),
    group: 0,
  }));
  const edges = [];

  for (let i = 0; i < numOfNodes - 1; i++) {
    for (let j = i + 1; j < numOfNodes; j++) {
      edges.push({ source: String(i), target: String(j), value: 1 });
    }
  }

  return { nodes, edges };
}
