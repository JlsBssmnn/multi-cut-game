import { LogicalGraph } from "../types/graph";

export default function fullyConnected(numOfNodes: number): LogicalGraph {
  const nodes = Array.from(Array(numOfNodes).keys()).map((i) => ({
    id: i,
    group: i,
  }));
  const edges = [];

  for (let i = 0; i < numOfNodes - 1; i++) {
    for (let j = i + 1; j < numOfNodes; j++) {
      edges.push({
        source: i,
        target: j,
        value: 1 - 2 * Number(Math.random() < 0.5),
      });
    }
  }

  return { nodes, edges };
}
