import { Dispatch, SetStateAction } from "react";
import {
  LogicalEdge,
  LogicalGraph,
  PartialClusterNode,
} from "../../../types/graph";
import { ClusterDragEvent, NodeDragEvent } from "../DragEvent";
import {
  completeAction,
  getAction,
  handleClusterMove,
  handleNodeMove,
  unvisualizeAction,
  visualizeAction,
} from "./actions/general";
import {
  commitJoinClusters,
  unvisualizeJoinClusters,
  visualizeJoinClusters,
} from "./actions/joinClusters";
import {
  commitMoveOut,
  unvisualizeMoveOut,
  visualizeMoveOut,
} from "./actions/moveOut";
import {
  commitMoveToCluster,
  unvisualizeMoveToCluster,
  visualizeMoveToCluster,
} from "./actions/moveToCluster";
import {
  computeClusterEdges,
  computeSubgraphEdges,
  getClusterNode,
  getClusterNodeID,
  getNode,
  getAbsoluteNodePosition,
  removeClusterNode,
  removeNode,
  changeClusterSize,
  updateClusterEdges,
  makeOpaque,
  updateClusterNode,
} from "./helpers";
import { moveNode } from "./moveNode";
import { nodeAt } from "./nodeAt";
import {
  applyJoinClusters,
  applyMoveToCluster,
  applyMoveOut,
  sendAction,
} from "./sendAction";

/**
 * This represents a partially rendered graph: The nodes are rendered (contain
 * actual coordinates that will be used to position the elements), but the edges
 * are just indices into the nodes and don't contain any position-properties.
 */
export default class PartialGraph {
  /**
   * An array of positions for the nodes.
   */
  nodes: PartialClusterNode[];

  /**
   * The indices of the source and target node that are connected by this edge
   */
  edges: LogicalEdge[];

  logicalGraph: LogicalGraph;
  nodeSize: number;
  opacity: number;
  theme!: {
    nodeColor: string;
    clusterNodeColor: string;
    tempClusterColor: string;
  };

  /**
   * A react state setter, which will be called with the new logcial graph
   * whenever the logical graph changes.
   */
  emitGraphChange!: Dispatch<SetStateAction<LogicalGraph>>;

  dragEvent: ClusterDragEvent | NodeDragEvent | null = null;

  /**
   * Holds the clusterNodeID of a cluster that was created for visualizing/previewing
   * an action, but the cluster doesn't actually exist in the actual clustering.
   */
  temporaryCluster: number | null = null;

  constructor(
    nodes: PartialClusterNode[],
    edges: LogicalEdge[],
    logicalGraph: LogicalGraph,
    nodeSize: number,
    opacity: number
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.logicalGraph = logicalGraph;
    this.nodeSize = nodeSize;
    this.opacity = opacity;
  }

  setTheme(theme: typeof this.theme) {
    this.theme = theme;
  }

  // helpers
  getClusterNode = getClusterNode;
  getNode = getNode;
  getAbsoluteNodePosition = getAbsoluteNodePosition;
  getClusterNodeID = getClusterNodeID;
  removeNode = removeNode;
  removeClusterNode = removeClusterNode;
  computeClusterEdges = computeClusterEdges;
  computeSubgraphEdges = computeSubgraphEdges;
  changeClusterSize = changeClusterSize;
  updateClusterEdges = updateClusterEdges;
  makeOpaque = makeOpaque;
  updateClusterNode = updateClusterNode;

  // the 3 main stages
  nodeAt = nodeAt;
  moveNode = moveNode;
  sendAction = sendAction;

  // change the logical graph
  applyMoveOut = applyMoveOut;
  applyMoveToCluster = applyMoveToCluster;
  applyJoinClusters = applyJoinClusters;

  // everything concerning actions and how to display them
  // helpers
  getAction = getAction;
  protected handleClusterMove = handleClusterMove;
  protected handleNodeMove = handleNodeMove;
  completeAction = completeAction;

  // visualizing
  unvisualizeAction = unvisualizeAction;
  visualizeAction = visualizeAction;
  visualizeMoveOut = visualizeMoveOut;
  unvisualizeMoveOut = unvisualizeMoveOut;
  commitMoveOut = commitMoveOut;
  visualizeMoveToCluster = visualizeMoveToCluster;
  unvisualizeMoveToCluster = unvisualizeMoveToCluster;
  commitMoveToCluster = commitMoveToCluster;
  visualizeJoinClusters = visualizeJoinClusters;
  unvisualizeJoinClusters = unvisualizeJoinClusters;
  commitJoinClusters = commitJoinClusters;
}
