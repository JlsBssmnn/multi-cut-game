import { GeneralNode, PartialSubgraph } from "../../types/graph";
import { getSubgraphSize } from "../calculations/geometry";
import PartialGraph from "../graph_rendering/PartialGraph/PartialGraph";
import { scaleGridLayout } from "../graph_scaling/gridScaling";
import { forceClusterLayout, forceSubgraphLayout } from "./forceLayout";
import {
  computeSubgraphSize,
  gridClusterLayout,
  gridSubgraphLayout,
} from "./gridLayout";
import { scaleLayout } from "./scaleGraph";

export type ClusterLayoutAlgorithm = (graph: PartialGraph) => void;
export type SubgraphLayoutAlgorithm = (
  graph: PartialGraph,
  subgraph: PartialSubgraph
) => void;
export type ComputeSubgraphSize = (
  graph: PartialGraph,
  subgraph: PartialSubgraph
) => number;
export type ScaleSubgraph = (
  nodes: GeneralNode[],
  width: number,
  height: number,
  margin: number
) => void;

export type LayoutAlgorithmName = "force" | "grid";

export type Layout = {
  clusterLayout: ClusterLayoutAlgorithm;
  subgraphLayout: SubgraphLayoutAlgorithm;
  computeSubgraphSize: ComputeSubgraphSize;
  scaleSubgraph: ScaleSubgraph;
};

type LayoutAlgorithmsType = {
  [key in LayoutAlgorithmName]: Layout;
};

export const LayoutAlgorithms: LayoutAlgorithmsType = {
  force: {
    clusterLayout: forceClusterLayout,
    subgraphLayout: forceSubgraphLayout,
    computeSubgraphSize: getSubgraphSize,
    scaleSubgraph: scaleLayout,
  },
  grid: {
    clusterLayout: gridClusterLayout,
    subgraphLayout: gridSubgraphLayout,
    computeSubgraphSize: computeSubgraphSize,
    scaleSubgraph: scaleGridLayout,
  },
};
