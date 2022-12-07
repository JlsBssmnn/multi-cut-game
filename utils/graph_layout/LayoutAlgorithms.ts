import { PartialSubgraph } from "../../types/graph";
import PartialGraph from "../graph_rendering/PartialGraph/PartialGraph";
import { forceClusterLayout, forceSubgraphLayout } from "./forceLayout";

export type ClusterLayoutAlgorithm = (graph: PartialGraph) => void;
export type SubgraphLayoutAlgorithm = (
  graph: PartialSubgraph,
  nodeSize: number
) => void;

export type LayoutAlgorithmName = "forceLayout";

type LayoutAlgorithmsType = {
  [key in LayoutAlgorithmName]: {
    clusterLayout: ClusterLayoutAlgorithm;
    subgraphLayout: SubgraphLayoutAlgorithm;
  };
};

export const LayoutAlgorithms: LayoutAlgorithmsType = {
  forceLayout: {
    clusterLayout: forceClusterLayout,
    subgraphLayout: forceSubgraphLayout,
  },
};
