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
