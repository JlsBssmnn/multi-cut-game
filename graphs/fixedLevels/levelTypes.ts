import { LogicalGraph } from "../../types/graph";
import { Layout } from "../../utils/graph_layout/LayoutAlgorithms";
import { Solution } from "../../utils/server_utils/findBestMulticut";

export interface Level {
  graph: LogicalGraph;
  solution: Solution;
  keyword: string;
  layout?: Layout;
}
