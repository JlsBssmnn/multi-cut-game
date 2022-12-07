import {
  LogicalEdge,
  LogicalGraph,
  PartialClusterNode,
  Node,
  PartialSubgraph,
} from "../../../types/graph";
import { clusterDiameter } from "../../calculations/geometry";
import { assertEdgesExists } from "../../graphUtils";
import PartialGraphTheme from "../PartialGraphTheme";
import PartialGraph from "./PartialGraph";

/**
 * Takes a logical graph, the size for an individual node and a graph theme
 * and constructs a partial graph out of this.
 */
export default function createPartialGraph(
  graph: LogicalGraph,
  nodeSize: number,
  theme: PartialGraphTheme
): PartialGraph {
  const clusterNodes = getClusters(graph, nodeSize, theme);
  const clusterEdges: LogicalEdge[] = getClusterEdges(graph);

  return new PartialGraph(clusterNodes, clusterEdges, graph, nodeSize, theme);
}

/**
 * Takes in a logical graph and computes the corresponding cluster nodes from it.
 */
export function getClusters(
  graph: LogicalGraph,
  nodeSize: number,
  theme: PartialGraphTheme
): PartialClusterNode[] {
  const clusters = new Set(graph.nodes.map((node) => node.group));
  return Array.from(clusters).map((cluster) => {
    const { nodes, edges } = getSubgraph(graph, nodeSize, theme, cluster);
    return {
      id: cluster,
      x: 0,
      y: 0,
      color: theme.getColor("clusterNodeColor"),
      size: clusterDiameter(nodes.length, nodeSize),
      subgraph: {
        nodes,
        edges,
      },
      borderColor: theme.getColor("clusterBorderColor"),
    };
  });
}

export function getSubgraph(
  graph: LogicalGraph,
  nodeSize: number,
  theme: PartialGraphTheme,
  clusterID: number
): PartialSubgraph {
  const logicalNodes = graph.nodes.filter((node) => node.group === clusterID);
  const nodeIDs = new Set(logicalNodes.map((node) => node.id));
  const logicalEdges = graph.edges.filter(
    (edge) => nodeIDs.has(edge.source) && nodeIDs.has(edge.target)
  );

  const nodeMap = new Map<number, Node>();
  const nodes = logicalNodes.map((logicalNode) => {
    const node = {
      id: logicalNode.id,
      x: 0,
      y: 0,
      color: theme.getColor("nodeColor"),
      size: nodeSize,
      group: clusterID,
    };
    nodeMap.set(logicalNode.id, node);

    return node;
  });

  const edges = logicalEdges.map((edge) => {
    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);
    if (!source || !target) {
      throw new Error("Edge connects non-existing nodes");
    }
    return {
      source: source,
      target: target,
      value: edge.value,
    };
  });

  return {
    nodes,
    edges,
  };
}

/**
 * Takes in a logical graph and a map that maps cluster node ids to the cluster nodes
 * and computes the corresponding cluster edges from it.
 */
export function getClusterEdges(graph: LogicalGraph): LogicalEdge[] {
  const nodeToGroup = new Map<number, number>();
  graph.nodes.forEach((node) => nodeToGroup.set(node.id, node.group));

  return Array.from(
    graph.edges
      .reduce((map, e) => {
        let sourceGroup = nodeToGroup.get(e.source);
        let targetGroup = nodeToGroup.get(e.target);

        [sourceGroup, targetGroup] = assertEdgesExists(
          sourceGroup,
          targetGroup
        );

        if (sourceGroup === targetGroup) {
          return map;
        } else if (sourceGroup > targetGroup) {
          [sourceGroup, targetGroup] = [targetGroup, sourceGroup];
        }
        const connection = `${sourceGroup}-${targetGroup}`;

        if (map.has(connection)) {
          map.set(connection, map.get(connection)! + e.value);
        } else {
          map.set(connection, e.value);
        }
        return map;
      }, new Map<string, number>())
      .entries()
  ).map(([key, value]) => {
    let source = parseInt(key.slice(0, key.indexOf("-")));
    let target = parseInt(key.slice(key.indexOf("-") + 1));

    return {
      source,
      target,
      value,
    };
  });
}
