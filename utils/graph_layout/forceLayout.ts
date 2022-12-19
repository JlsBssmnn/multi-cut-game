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

/**
 * A force based layout algorithm implemented with d3-js for laying out
 * a subgraph of a cluster node within a PartialGraph.
 */
export function forceSubgraphLayout(
  graph: PartialGraph,
  subgraph: PartialSubgraph
): void {
  const nodeMap = new Map<number, Node>();
  subgraph.nodes.forEach((node) => nodeMap.set(node.id, node));

  const d3Nodes = structuredClone(subgraph.nodes);
  const d3Edges = subgraph.edges.map((edge) => ({
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
    .force(
      "collision",
      d3.forceCollide((node) => node.size)
    )
    .force(
      "charge",
      d3.forceManyBody().strength(-30).distanceMax(graph.nodeSize)
    )
    .force("center", d3.forceCenter())
    .tick(300);

  simulation.nodes().forEach((d3Node) => {
    const [node] = assertEdgesExists(nodeMap.get(d3Node.id));
    node.x = d3Node.x - d3Node.size / 2;
    node.y = d3Node.y - d3Node.size / 2;
  });
}

/**
 * A force based layout algorithm implemented with d3-js for laying out
 * the cluster nodes of a PartialGraph.
 */
export function forceClusterLayout(graph: PartialGraph): void {
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
    .force(
      "collision",
      d3.forceCollide((node) => node.size)
    )
    .force("charge", d3.forceManyBody().strength(-30))
    .force("center", d3.forceCenter())
    .tick(300);

  simulation.nodes().forEach((d3Node) => {
    const [clusterNode] = assertEdgesExists(clusterNodeMap.get(d3Node.id));
    clusterNode.x = d3Node.x - d3Node.size / 2;
    clusterNode.y = d3Node.y - d3Node.size / 2;
  });
}
