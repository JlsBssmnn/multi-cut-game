import { LogicalGraph } from "../types/graph";

/**
 * Creates an n by n grid.
 */
export default function gridGraph(n: number): LogicalGraph {
  const nodes = Array.from(Array(n * n).keys()).map((i) => ({
    id: i,
    group: i,
  }));
  const edges = [];

  for (let i = 0; i < n * n; i++) {
    if ((i + 1) % n != 0) {
      edges.push({ source: i, target: i + 1, value: 0 });
    }
    if (i < n * n - n) {
      edges.push({ source: i, target: i + n, value: 0 });
    }
  }

  return { nodes, edges };
}
