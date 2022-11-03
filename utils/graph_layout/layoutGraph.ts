import * as d3 from "d3";
import { SimulationLinkDatum, SimulationNodeDatum } from "d3";
import {
  Edge,
  Graph,
  Node,
  PartiallyRenderedGraph,
  PartiallyRenderedNode,
} from "../../types/graph";
import { clusterDiameter } from "../calculations/geometry";

// d3 will take nodes and edges and attach additional information to them (like
// position). These new types are defined here.
type D3Node = SimulationNodeDatum & Node;
type D3Edge = SimulationLinkDatum<D3Node> & Edge;

type ClusterNode = SimulationNodeDatum & {
  id: number;
  numOfElements: number;
};

type ClusterEdge = SimulationLinkDatum<ClusterNode> & {
  source: number;
  target: number;
  value: number;
};

/**
 * Takes in a graph and computes the corresponding cluster nodes from it.
 */
export function getClusters(graph: Graph): ClusterNode[] {
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
export function getClusterEdges(graph: Graph): ClusterEdge[] {
  return Array.from(
    graph.edges
      .reduce((map, e) => {
        let sourceGroup = graph.nodes[parseInt(e.source)].group;
        let targetGroup = graph.nodes[parseInt(e.target)].group;

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
  graph: Graph,
  nodeSize: number
): PartiallyRenderedGraph {
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
    color: "black",
    size: nodeSize,
  }));

  // The edges point to nodes that got modified by d3 and are now actually
  // of a different type.
  const edges = graph.edges.map((edge) => {
    const sourceID = (edge.source as unknown as D3Node).id,
      targetID = (edge.target as unknown as D3Node).id;

    return {
      source: String(graph.nodes.findIndex((node) => node.id == sourceID)),
      target: String(graph.nodes.findIndex((node) => node.id == targetID)),
      value: edge.value,
    };
  });

  return {
    nodes,
    edges,
  };
}

export default function layoutGraph(
  graph: Graph,
  defaultNodeSize: number
): PartiallyRenderedGraph {
  const clusters = getClusters(graph);
  const clusterEdges = getClusterEdges(graph);

  const forceLink = d3
    .forceLink<ClusterNode, ClusterEdge>(clusterEdges)
    .id((node) => node.id)
    .strength(1)
    .distance(20)
    .iterations(10);

  const simulation = d3
    .forceSimulation<ClusterNode>(clusters)
    .force("link", forceLink)
    .force("charge", d3.forceManyBody().strength(-30))
    .force("center", d3.forceCenter())
    .tick(300);

  const nodes: PartiallyRenderedNode[] = simulation.nodes().map((obj) => ({
    id: String(obj.id),
    x: obj.x ?? 0,
    y: obj.y ?? 0,
    color: d3.schemeTableau10[obj.id % 10],
    size: clusterDiameter(obj.numOfElements, defaultNodeSize),
  }));

  const clusterIDs = clusters.map((node) => node.id);
  const edges = clusterEdges.map((edge) => ({
    source: String(clusterIDs.indexOf((edge.source as ClusterNode).id)),
    target: String(clusterIDs.indexOf((edge.target as ClusterNode).id)),
    value: edge.value,
  }));

  // loop over all clusters and add their contend to the nodes and edges
  nodes.forEach((cluster, i) => {
    const clusterID = clusterIDs[i];

    const clusterNodes = graph.nodes
      .filter((node) => node.group === clusterID)
      .map((node) => ({ ...node }));
    const clusterEdges = graph.edges
      .filter(
        (edge) =>
          graph.nodes[parseInt(edge.source)].group === clusterID &&
          graph.nodes[parseInt(edge.target)].group === clusterID
      )
      .map((edge) => ({ ...edge }));

    const renderedCluster = layoutCluster(
      { nodes: clusterNodes, edges: clusterEdges },
      defaultNodeSize
    );

    cluster.subgraph = renderedCluster;
  });

  return {
    nodes,
    edges,
  };
}
