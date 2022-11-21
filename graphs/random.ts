import { LogicalGraph } from "../types/graph";
import { connectedComponents } from "../utils/calculations/graphCalculations";
import { randomInt } from "../utils/utils";

/**
 * Creates a graph with `numOfNodes` nodes. The link probability is the probability that
 * two nodes will be connected, it defaults to 0.5. If the parameter `ensureConnected` is
 * true, it will make sure that the final graph is connected (by inserting more edges which
 * might change the number of edges s.t. it's not representing the given `linkProbability` anymore).
 */
export default function randomGraph(
  numOfNodes: number,
  linkProbability: number = 0.5,
  ensureConnected: boolean = true
): LogicalGraph {
  const nodes = Array.from(Array(numOfNodes).keys()).map((i) => ({
    id: i,
    group: i,
  }));
  const edges = [];

  for (let i = 0; i < numOfNodes - 1; i++) {
    for (let j = i + 1; j < numOfNodes; j++) {
      if (Math.random() < linkProbability) {
        edges.push({ source: i, target: j, value: 0 });
      }
    }
  }

  const graph = { nodes, edges };
  if (!ensureConnected) return graph;

  const components = connectedComponents(graph);
  for (let i = 0; i < components.length - 1; i++) {
    for (let j = i + 1; j < components.length; j++) {
      const sourceComponent = components[i];
      const sourceNode = sourceComponent[randomInt(0, sourceComponent.length)];

      const targetComponent = components[j];
      const targetNode = targetComponent[randomInt(0, targetComponent.length)];

      edges.push({ source: sourceNode.id, target: targetNode.id, value: 0 });
    }
  }
  return graph;
}
