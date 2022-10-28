import * as d3 from "d3";
import { SimulationLinkDatum, SimulationNodeDatum } from "d3";
import { GraphRenderInfo } from "../../react_components/GraphRenderer";
import { Edge, Graph, Node } from "../../types/graph";

// d3 will take nodes and edges and attach additional information to them (like
// position). These new types are defined here.
type RenderNode = SimulationNodeDatum & Node;
type RenderEdge = SimulationLinkDatum<RenderNode> & Edge;

export default function getGraphLayoutD3(graph: Graph): GraphRenderInfo {
  const forceLink = d3
    .forceLink<RenderNode, RenderEdge>(graph.edges)
    .id((node) => node.id)
    .strength(1)
    .distance(20)
    .iterations(10);

  const simulation = d3
    .forceSimulation<RenderNode>(graph.nodes)
    .force("link", forceLink)
    .force("charge", d3.forceManyBody().strength(-30))
    .force("center", d3.forceCenter())
    .tick(300);

  const nodes = simulation
    .nodes()
    .map((obj) => ({ x: obj.x ?? 0, y: obj.y ?? 0 }));

  // The edges point to nodes that got modified by d3 and are now actually
  // RenderNodes.
  const edges = graph.edges.map((edge) => ({
    source: parseInt((edge.source as unknown as RenderNode).id),
    target: parseInt((edge.target as unknown as RenderNode).id),
  }));

  return {
    nodes,
    edges,
  };
}
