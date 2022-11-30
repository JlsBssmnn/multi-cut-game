import { Common } from "./common";

export interface LogicalNode {
  id: number;
  group: number;
}

export interface LogicalEdge {
  source: LogicalNode["id"];
  target: LogicalNode["id"];
  value: number;
  opacity?: number;
}

export interface LogicalGraph {
  nodes: LogicalNode[];
  edges: LogicalEdge[];
}

export type PartialClusterNode = {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  subgraph: PartialSubgraph;
  borderColor: string;
};

export interface PartialSubgraph {
  nodes: Node[];
  edges: LogicalEdge[];
}

export interface Node
  extends Omit<PartialClusterNode, "subgraph" | "borderColor"> {
  group: number;
}

export type GeneralNode = Common<PartialClusterNode, Node>;
