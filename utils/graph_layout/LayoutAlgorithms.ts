import { PartialSubgraph } from "../../types/graph";
import { getSubgraphSize } from "../calculations/geometry";
import PartialGraph from "../graph_rendering/PartialGraph/PartialGraph";
import { forceClusterLayout, forceSubgraphLayout } from "./forceLayout";
import {
  computeSubgraphSize,
  gridClusterLayout,
  gridSubgraphLayout,
} from "./gridLayout";

export type ClusterLayoutAlgorithm = (graph: PartialGraph) => void;
export type SubgraphLayoutAlgorithm = (
  graph: PartialGraph,
  subgraph: PartialSubgraph
) => void;
export type ComputeSubgraphSize = (
  graph: PartialGraph,
  subgraph: PartialSubgraph
) => number;

export type LayoutAlgorithmName = "forceLayout" | "grid";

export type Layout = {
  clusterLayout: ClusterLayoutAlgorithm;
  subgraphLayout: SubgraphLayoutAlgorithm;
  computeSubgraphSize: ComputeSubgraphSize;
};

type LayoutAlgorithmsType = {
  [key in LayoutAlgorithmName]: Layout;
};

export const LayoutAlgorithms: LayoutAlgorithmsType = {
  forceLayout: {
    clusterLayout: forceClusterLayout,
    subgraphLayout: forceSubgraphLayout,
    computeSubgraphSize: getSubgraphSize,
  },
  grid: {
    clusterLayout: gridClusterLayout,
    subgraphLayout: gridSubgraphLayout,
    computeSubgraphSize: computeSubgraphSize,
  },
};
