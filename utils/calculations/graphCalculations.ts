import { LogicalGraph, LogicalNode } from "../../types/graph";
import { MulticutDecisions, Solution } from "../server_utils/findBestMulticut";

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

  // remove cut edges
  newGraph.edges = newGraph.edges.filter((edge) => {
    let { source, target } = edge;
    if (target < source) {
      [source, target] = [target, source];
    }
    return solution.decisions[`${source}-${target}`] === 0;
  });

  const components = connectedComponents(newGraph);
  components.forEach((component, i) => {
    component.forEach((node) => {
      node.group = i;
    });
  });

  return {
    nodes: newGraph.nodes,
    edges: graph.edges,
  };
}

/**
 * Find the connected components in the given graph and returns them
 * as an array of arrays of nodes.
 */
export function connectedComponents(graph: LogicalGraph): LogicalNode[][] {
  const nodeMap = new Map<number, LogicalNode>();
  graph.nodes.forEach((node) => nodeMap.set(node.id, node));

  const neighbors = new Map<number, number[]>();
  graph.edges.forEach((edge) => {
    let { source, target } = edge;

    if (neighbors.has(source)) {
      neighbors.get(source)!.push(target);
    } else {
      neighbors.set(source, [target]);
    }

    if (neighbors.has(target)) {
      neighbors.get(target)!.push(source);
    } else {
      neighbors.set(target, [source]);
    }
  });

  const components: LogicalNode[][] = [];
  const visitedNodes = new Set<number>();

  function bfs(node: LogicalNode, component: LogicalNode[]): LogicalNode[] {
    if (visitedNodes.has(node.id)) return component;

    visitedNodes.add(node.id);
    component.push(node);

    const nodeNeighbors = neighbors.get(node.id);
    if (!nodeNeighbors) return component;

    for (const otherNode of nodeNeighbors) {
      const newNode = nodeMap.get(otherNode);
      if (!newNode) {
        throw new Error(
          "Edge connects node which doesn't " +
            "exist in the nodes of the graph"
        );
      }
      bfs(newNode, component);
    }
    return component;
  }

  graph.nodes.forEach((node) => {
    if (!visitedNodes.has(node.id)) {
      components.push(bfs(node, []));
    }
  });

  return components;
}

/**
 * Takes a logical graph and outputs the decisions made for every edge, that is
 * whether the edge is cut (1) or not cut (0).
 */
export function getDecisionsFromGraph(graph: LogicalGraph): MulticutDecisions {
  const nodeToGroup = new Map<number, number>();
  graph.nodes.forEach((node) => nodeToGroup.set(node.id, node.group));

  const decisions: MulticutDecisions = {};

  graph.edges.forEach((edge) => {
    let { source, target } = edge;
    if (source > target) {
      [source, target] = [target, source];
    }
    const decision = Number(
      nodeToGroup.get(source) !== nodeToGroup.get(target)
    );
    decisions[`${source}-${target}`] = decision;
  });

  return decisions;
}

/**
	* Computes whether the given solution can be a solution for the given graph.
	* It checks if all nodes in the solution are present and if they are actually
	* connected by the graph.
	*/
export function isCorrectSolution(graph: LogicalGraph, solution: Solution): boolean {
	if (solution.cost > 0) return false;

	const edgeSet = new Set<string>(
		graph.edges.map(edge => {
			let {source, target} = edge;
			if (source > target) {
				[source, target] = [target, source];
			}
			return `${source}-${target}`;
		})
	);

	return Object.keys(solution.decisions).every(decision => {
		if (edgeSet.has(decision)) return true;

		const source = decision.substring(0, decision.indexOf('-'));
		const target = decision.substring(decision.indexOf('-') + 1);

		return edgeSet.has(`${target}-${source}`);
	})
}
