import { PartialSubgraph } from "../../types/graph";
import PartialGraph from "../graph_rendering/PartialGraph/PartialGraph";
import { forceClusterLayout, forceSubgraphLayout } from "./forceLayout";

export type ClusterLayoutAlgorithm = (graph: PartialGraph) => void;
export type SubgraphLayoutAlgorithm = (
  graph: PartialSubgraph,
  nodeSize: number
) => void;

export type LayoutAlgorithmName = "forceLayout";

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
};
