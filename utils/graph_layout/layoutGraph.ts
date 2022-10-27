import * as d3 from "d3";
import { GraphRenderInfo } from "../../react_components/Graph";
import { Graph } from "../../types/graph";

export default function getGraphLayoutD3(graph: Graph): GraphRenderInfo {
  const forceLink = d3.forceLink(graph.links).id((node) => node.id);

  const nodes = d3
    .forceSimulation(graph.nodes)
    .force("link", forceLink)
    .nodes()
    .map((obj) => ({ x: obj.x, y: obj.y }));
  const edges = graph.edges.map((edge) => ({
    source: parseInt(edge.source),
    target: parseInt(edge.target),
  }));

  return {
    nodes,
    edges,
  };
}
