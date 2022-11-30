import { Common } from "./common";

export interface GeneralEdge {
	source: any;
	target: any;
	value: number;
}

export interface LogicalNode {
  id: number;
  group: number;
}

export interface LogicalEdge extends GeneralEdge {
  source: LogicalNode["id"];
  target: LogicalNode["id"];
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
  edges: Edge[];
}

export interface Node
  extends Omit<PartialClusterNode, "subgraph" | "borderColor"> {
  group: number;
}

export type GeneralNode = Common<PartialClusterNode, Node>;

export interface ClusterEdge extends GeneralEdge {
  source: PartialClusterNode;
  target: PartialClusterNode;
  opacity?: number;
}

export interface Edge extends GeneralEdge {
  source: Node;
  target: Node;
  opacity?: number;
}
