import * as d3 from "d3";
import { SimulationLinkDatum, SimulationNodeDatum } from "d3";
import {
  LogicalEdge,
  Node,
  PartialClusterNode,
  PartialSubgraph,
} from "../../types/graph";
import { assertEdgesExists } from "../graphUtils";
import PartialGraph from "../graph_rendering/PartialGraph/PartialGraph";

// d3 will take nodes and edges and attach additional information to them (like
// position). These new types are defined here.
type D3Node = SimulationNodeDatum & Node;
type D3Edge = SimulationLinkDatum<D3Node> & LogicalEdge;

type D3ClusterNode = SimulationNodeDatum & PartialClusterNode;
type D3ClusterEdge = SimulationLinkDatum<D3ClusterNode> & LogicalEdge;

export function layoutCluster(graph: PartialSubgraph, nodeSize: number): void {
  const nodeMap = new Map<number, Node>();
  graph.nodes.forEach((node) => nodeMap.set(node.id, node));

  const d3Nodes = structuredClone(graph.nodes);
  const d3Edges = graph.edges.map((edge) => ({
    source: edge.source.id,
    target: edge.target.id,
    value: edge.value,
  }));

  const forceLink = d3
    .forceLink<D3Node, D3Edge>(d3Edges)
    .id((node) => node.id)
    .strength(1)
    .distance(20)
    .iterations(10);

  const simulation = d3
    .forceSimulation<D3Node>(d3Nodes)
    .force("link", forceLink)
    .force("charge", d3.forceManyBody().strength(-30).distanceMax(nodeSize))
    .force("center", d3.forceCenter())
    .tick(300);

  simulation.nodes().forEach((d3Node) => {
    const [node] = assertEdgesExists(nodeMap.get(d3Node.id));
    node.x = d3Node.x;
    node.y = d3Node.y;
  });
}

/**
 * A force based layout algorithm implemented with d3-js.
 */
export default function layoutGraph(graph: PartialGraph): void {
  const clusterNodeMap = new Map<number, PartialClusterNode>();
  graph.nodes.forEach((node) => clusterNodeMap.set(node.id, node));

  const clusters = structuredClone(graph.nodes);
  const clusterEdges = graph.edges.map((edge) => ({
    source: edge.source.id,
    target: edge.target.id,
    value: edge.value,
  }));

  const forceLink = d3
    .forceLink<D3ClusterNode, D3ClusterEdge>(clusterEdges)
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

  simulation.nodes().forEach((d3Node) => {
    const [clusterNode] = assertEdgesExists(clusterNodeMap.get(d3Node.id));
    clusterNode.x = d3Node.x;
    clusterNode.y = d3Node.y;
  });

  graph.nodes.forEach((cluster) => {
    layoutCluster(cluster.subgraph, graph.nodeSize);
  });
}
