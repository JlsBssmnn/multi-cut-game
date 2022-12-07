import { PartialSubgraph } from "../../types/graph";
import PartialGraph from "../graph_rendering/PartialGraph/PartialGraph";
import { forceClusterLayout, forceSubgraphLayout } from "./forceLayout";
import { gridClusterLayout, gridSubgraphLayout } from "./gridLayout";

export type ClusterLayoutAlgorithm = (graph: PartialGraph) => void;
export type SubgraphLayoutAlgorithm = (
  graph: PartialGraph,
  subgraph: PartialSubgraph
) => void;

export type LayoutAlgorithmName = "forceLayout" | "grid";

export type Layout = {
  clusterLayout: ClusterLayoutAlgorithm;
  subgraphLayout: SubgraphLayoutAlgorithm;
};

type LayoutAlgorithmsType = {
  [key in LayoutAlgorithmName]: Layout;
};

export const LayoutAlgorithms: LayoutAlgorithmsType = {
  forceLayout: {
    clusterLayout: forceClusterLayout,
    subgraphLayout: forceSubgraphLayout,
  },
  grid: {
    clusterLayout: gridClusterLayout,
    subgraphLayout: gridSubgraphLayout,
  },
};
