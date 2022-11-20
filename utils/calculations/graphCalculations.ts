import { LogicalGraph, LogicalNode } from "../../types/graph";
import { Solution } from "../server_utils/findBestMulticut";

/**
 * Computes the total cost for the clustering of the given
 * graph. This is the sum of the costs of all cut edges.
 */
export function getGraphScore(graph: LogicalGraph): number {
  // map from nodeID to it's group
  const nodeMap = new Map<number, number>();
  graph.nodes.forEach((node) => {
    nodeMap.set(node.id, node.group);
  });

  return graph.edges.reduce((cost, edge) => {
    if (nodeMap.get(edge.source) !== nodeMap.get(edge.target)) {
      cost += edge.value;
    }
    return cost;
  }, 0);
}

/**
 * Computes the optimal clustering depending on the provided
 * solution. The returned value is a `LogicalGraph` and the
 * group attribute of the nodes encodes the clustering.
 */
export function getGraphFromSolution(
  graph: LogicalGraph,
  solution: Solution
): LogicalGraph {
  const newGraph = structuredClone(graph);

  const nodeMap = new Map<number, LogicalNode>();
  newGraph.nodes.forEach((node) => nodeMap.set(node.id, node));

  const neighbors = new Map<number, Set<number>>();
  newGraph.edges.forEach((edge) => {
    let { source, target } = edge;
    if (target < source) {
      [source, target] = [target, source];
    }
    // check if edge was cut
    if (solution.decisions[`${source}-${target}`] === 0) {
      if (neighbors.has(source)) {
        neighbors.get(source)!.add(target);
      } else {
        neighbors.set(source, new Set([target]));
      }

      if (neighbors.has(target)) {
        neighbors.get(target)!.add(source);
      } else {
        neighbors.set(target, new Set([source]));
      }
    }
  });

  const visitedNodes = new Set<number>();
  let group = 0;

  function bfs(node: LogicalNode) {
    if (visitedNodes.has(node.id)) return;

    visitedNodes.add(node.id);
    node.group = group;
    const nodeNeighbors = neighbors.get(node.id);
    if (!nodeNeighbors) return;

    for (const otherNode of Array.from(nodeNeighbors)) {
      const newNode = nodeMap.get(otherNode);
      if (!newNode) {
        throw new Error(
          "Edge connects node which doesn't " +
            "exist in the nodes of the graph"
        );
      }
      bfs(newNode);
    }
  }

  newGraph.nodes.forEach((node) => {
    bfs(node);
    group++;
  });

  return newGraph;
}
