import * as d3 from "d3";
import { SimulationLinkDatum, SimulationNodeDatum } from "d3";
import {
  LogicalEdge,
  LogicalGraph,
  LogicalNode,
  PartialClusterNode,
  PartialSubgraph,
} from "../../types/graph";
import { clusterDiameter } from "../calculations/geometry";
import PartialGraph from "../graph_rendering/PartialGraph/PartialGraph";
import PartialGraphTheme from "../graph_rendering/PartialGraphTheme";

// d3 will take nodes and edges and attach additional information to them (like
// position). These new types are defined here.
type D3Node = SimulationNodeDatum & LogicalNode;
type D3Edge = SimulationLinkDatum<D3Node> & LogicalEdge;

type D3ClusterNode = SimulationNodeDatum & {
  id: number;
  numOfElements: number;
};

type ClusterEdge = SimulationLinkDatum<D3ClusterNode> & {
  source: number;
  target: number;
  value: number;
};

/**
 * Takes in a graph and computes the corresponding cluster nodes from it.
 */
export function getClusters(graph: LogicalGraph): D3ClusterNode[] {
  const clusterMap = graph.nodes.reduce((map, node) => {
    if (map.has(node.group)) {
      map.set(node.group, map.get(node.group)! + 1);
    } else {
      map.set(node.group, 1);
    }
    return map;
  }, new Map<number, number>());
  return Array.from(clusterMap.entries()).map(([id, numOfElements]) => ({
    id,
    numOfElements,
  }));
}

/**
 * Takes in a graph and computes the corresponding cluster edges from it.
 */
export function getClusterEdges(graph: LogicalGraph): ClusterEdge[] {
  return Array.from(
    graph.edges
      .reduce((map, e) => {
        let sourceGroup = graph.nodes[e.source].group;
        let targetGroup = graph.nodes[e.target].group;

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
  ).map(([key, value]) => ({
    source: parseInt(key.slice(0, key.indexOf("-"))),
    target: parseInt(key.slice(key.indexOf("-") + 1)),
    value,
  }));
}

export function layoutCluster(
  graph: LogicalGraph,
  nodeSize: number,
  theme: PartialGraphTheme,
  clusterID: number
): PartialSubgraph {
  const forceLink = d3
    .forceLink<D3Node, D3Edge>(graph.edges)
    .id((node) => node.id)
    .strength(1)
    .distance(20)
    .iterations(10);

  const simulation = d3
    .forceSimulation<D3Node>(graph.nodes)
    .force("link", forceLink)
    .force("charge", d3.forceManyBody().strength(-30).distanceMax(nodeSize))
    .force("center", d3.forceCenter())
    .tick(300);

  const nodes = simulation.nodes().map((obj) => ({
    id: obj.id,
    x: obj.x ?? 0,
    y: obj.y ?? 0,
    color: theme.getColor("nodeColor"),
    size: nodeSize,
    group: clusterID,
  }));

  // The edges point to nodes that got modified by d3 and are now actually
  // of a different type.
  const edges = graph.edges.map((edge) => ({
    source: (edge.source as unknown as D3Node).id,
    target: (edge.target as unknown as D3Node).id,
    value: edge.value,
  }));

  return {
    nodes,
    edges,
  };
}

export default function layoutGraph(
  graph: LogicalGraph,
  nodeSize: number,
  theme: PartialGraphTheme
): PartialGraph {
  const clusters = getClusters(graph);
  const clusterEdges = getClusterEdges(graph);

  const forceLink = d3
    .forceLink<D3ClusterNode, ClusterEdge>(clusterEdges)
    .id((node) => node.id)
    .strength(1)
    .distance(20)
    .iterations(10);

  const simulation = d3
    .forceSimulation<D3ClusterNode>(clusters)
    .force("link", forceLink)
    .force("charge", d3.forceManyBody().strength(-30))
    .force("center", d3.forceCenter())
    .tick(300);

  const nodes: PartialClusterNode[] = simulation.nodes().map((obj) => ({
    id: obj.id,
    x: obj.x ?? 0,
    y: obj.y ?? 0,
    color: theme.getColor("clusterNodeColor"),
    size: clusterDiameter(obj.numOfElements, nodeSize),
    subgraph: {
      nodes: [],
      edges: [],
    },
    borderColor: theme.getColor("clusterBorderColor"),
  }));

  const clusterIDs = clusters.map((node) => node.id);
  const edges = clusterEdges.map((edge) => ({
    source: (edge.source as D3ClusterNode).id,
    target: (edge.target as D3ClusterNode).id,
    value: edge.value,
  }));

  // loop over all clusters and add their contend to the nodes and edges
  nodes.forEach((cluster, i) => {
    const clusterID = clusterIDs[i];

    // store all the ids of nodes in this cluster
    const nodesInCluster = new Set();
    const nodes = graph.nodes
      .filter((node) => node.group === clusterID)
      .map((node) => {
        nodesInCluster.add(node.id);
        return { ...node };
      });

    const edges = graph.edges
      .filter(
        (edge) =>
          nodesInCluster.has(edge.source) && nodesInCluster.has(edge.target)
      )
      .map((edge) => ({ ...edge }));

    const renderedCluster = layoutCluster(
      { nodes, edges },
      nodeSize,
      theme,
      clusterID
    );

    cluster.subgraph = renderedCluster;
  });

  return new PartialGraph(nodes, edges, graph, nodeSize, theme);
}
