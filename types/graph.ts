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
 * This represents a partially rendered graph: The nodes are rendered (contain
 * actual coordinates that will be used to position the elements), but the edges
 * are just indices into the nodes and don't contain any position-properties.
 */
export interface PartiallyRenderedGraph {
  /**
   * An array of positions for the nodes.
   */
  nodes: PartiallyRenderedNode[];

  /**
   * The indices of the source and target node that are connected by this edge
   */
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
