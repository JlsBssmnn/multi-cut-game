export interface LogicalNode {
  id: string;
  group: number;
}

export interface LogicalEdge {
  source: string;
  target: string;
  value: number;
}

export interface LogicalGraph {
  nodes: LogicalNode[];
  edges: LogicalEdge[];
}

export type PartialClusterNode = {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  subgraph: PartialSubgraph;
};

export interface PartialSubgraph {
  nodes: Node[];
  edges: LogicalEdge[];
}

export type ClusterNode = Omit<PartialClusterNode, "subgraph"> & {
  subgraph: Subgraph;
};

export type Node = Omit<PartialClusterNode, "subgraph">;

export interface Edge {
  left: number;
  top: number;
  width: number;
  transform: string;
}

export interface Subgraph {
  nodes: Node[];
  edges: Edge[];
}

/**
 * This represents all the information that is necessary to render a graph.
 * It contains information about things like the position of nodes. It
 * doesn't contain logical information that isn't necessary for rendering the
 * graph, like cluster information.
 */
export interface Graph {
  nodes: ClusterNode[];
  edges: Edge[];
}
