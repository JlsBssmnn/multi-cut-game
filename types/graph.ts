import PartiallyRenderedGraph from "../utils/graph_rendering/PartiallyRenderedGraph";

export interface Node {
  id: string;
  group: number;
}

export interface Edge {
  source: string;
  target: string;
  value: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

/**
 * This represents all the information that is necessary to render a graph.
 * It contains information about things like the position of nodes. It
 * doesn't contain logical information that isn't necessary for rendering the
 * graph, like cluster information.
 */
export interface RenderedGraph {
  nodes: RenderedNode[];
  edges: RenderedEdge[];
}

export type PartiallyRenderedNode = {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  subgraph?: PartiallyRenderedGraph;
};

export type RenderedNode = Omit<PartiallyRenderedNode, "subgraph"> & {
  subgraph?: RenderedGraph;
};

export interface RenderedEdge {
  left: number;
  top: number;
  width: number;
  transform: string;
}
