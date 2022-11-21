import { LogicalGraph } from "../types/graph";
import { shuffle } from "../utils/utils";

/**
 * Picks the value for each edge randomly.
 * @param negativeCostProbability The probability that an edge will get a value of -1
 */
export function randomCostGenerator(
  graph: LogicalGraph,
  negativeCostProbability: number = 0.5
): LogicalGraph {
  graph.edges.forEach(
    (edge) =>
      (edge.value = 1 - 2 * Number(Math.random() < negativeCostProbability))
  );

  return graph;
}

/**
 * Pick the value for each edge randomly but ensures the given ratio. That means the ratio
 * of -1 edges relative to the total number of edges will be around `negativeCostRatio`. If
 * the ratio can't be applied exactly the number of -1 edges are floored.
 */
export function ratioCostGenerator(
  graph: LogicalGraph,
  negativeCostRatio: number = 0.5
): LogicalGraph {
  const edgeCount = graph.edges.length;
  const negativeEdgeCount = Math.floor(edgeCount * negativeCostRatio);

  const values = new Array(graph.edges.length)
    .fill(-1, 0, negativeEdgeCount)
    .fill(1, negativeEdgeCount);
  shuffle(values);

  graph.edges.forEach((edge, i) => (edge.value = values[i]));
  return graph;
}
