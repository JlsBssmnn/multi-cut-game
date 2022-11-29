import {
  Edge,
  GeneralNode,
  Graph,
  LogicalEdge,
  Node,
  PartialClusterNode,
  PartialSubgraph,
  Subgraph,
} from "../../types/graph";
import PartialGraph from "../graph_rendering/PartialGraph/PartialGraph";
import PartialGraphTheme from "../graph_rendering/PartialGraphTheme";

/**
 * This function takes a partially rendered graph and renders the edges of that
 * graph. This is done by computing the a line between every pair of nodes that
 * are connected by an edge. The result of this function is a fully rendered graph.
 */
export default function renderPartialGraph(
  graph: PartialGraph,
  edgeThickness: number
): Graph {
  const nodeMap = new Map<number, PartialClusterNode | Node>();

  const nodes = graph.nodes.map((node) => {
    nodeMap.set(node.id, node);
    return {
      ...node,
      subgraph: renderSubgraphEdges(node.subgraph, edgeThickness, graph.theme),
    };
  });

  return {
    nodes,
    edges: renderEdges(nodeMap, graph.edges, edgeThickness, graph.theme),
  };
}

function renderSubgraphEdges(
  graph: PartialSubgraph,
  edgeThickness: number,
  theme: PartialGraphTheme
): Subgraph {
  const nodeMap = new Map<number, Node>();
  graph.nodes.forEach((node) => nodeMap.set(node.id, node));

  return {
    nodes: graph.nodes,
    edges: renderEdges(nodeMap, graph.edges, edgeThickness, theme),
  };
}

function renderEdges(
  nodeMap: Map<number, GeneralNode>,
  edges: LogicalEdge[],
  edgeThickness: number,
  theme: PartialGraphTheme
): Edge[] {
  return edges.map((edge) => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    if (!sourceNode || !targetNode) {
      const missingNode = !sourceNode ? edge.source : edge.target;
      throw new Error(
        `An edge connects nodes ${edge.source} and ${edge.target},` +
          ` but there is no node with the id ${missingNode}`
      );
    }

    let { x: sourceX, y: sourceY, size: sourceSize } = sourceNode;
    let { x: targetX, y: targetY, size: targetSize } = targetNode;

    sourceX += sourceSize / 2;
    sourceY += sourceSize / 2;
    targetX += targetSize / 2;
    targetY += targetSize / 2;

    const length = Math.sqrt(
      (sourceX - targetX) ** 2 + (sourceY - targetY) ** 2
    );
    const angle =
      Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI);

    if (edge.value === 0) {
      var color = theme.getColor("neutralEdgeColor");
    } else if (edge.value > 0) {
      var color = theme.getColor("positiveEdgeColor");
    } else {
      var color = theme.getColor("negativeEdgeColor");
    }

    return {
      left: sourceX,
      top: sourceY,
      width: length,
      height: computeEdgeThickness(edgeThickness, edge.value),
      backgroundColor: color,
      transform: `rotate(${angle}deg)`,
      opacity: edge.opacity,
    };
  });
}

/**
 * This function computes the thickness of a rendered edge in pixels
 * depending on it's value by using the provided `edgeThickness` parameter.
 */
export function computeEdgeThickness(
  edgeThickness: number,
  value: number
): number {
  if (value === 0) {
    return Math.sqrt(edgeThickness);
  }
  return Math.sqrt(edgeThickness * Math.abs(value));
}
