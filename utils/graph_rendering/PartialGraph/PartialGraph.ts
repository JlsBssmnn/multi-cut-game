import { Dispatch, SetStateAction } from "react";
import {
  LogicalEdge,
  LogicalGraph,
  PartialClusterNode,
} from "../../../types/graph";
import { ClusterDragEvent, NodeDragEvent } from "../DragEvent";
import PartialGraphTheme from "../PartialGraphTheme";
import {
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
  theme: PartialGraphTheme;

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

  /**
   * A history of valid states throughout the playthrough of the game. This is
   * used to reset the graph when the user performs an invalid action or when
   * the user wants to undo an action.
   */
  lastStates: {
    nodes: PartialClusterNode[];
    edges: LogicalEdge[];
    logicalGraph: LogicalGraph;
  }[] = [];

  constructor(
    nodes: PartialClusterNode[],
    edges: LogicalEdge[],
    logicalGraph: LogicalGraph,
    nodeSize: number,
    theme: PartialGraphTheme
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.logicalGraph = logicalGraph;
    this.nodeSize = nodeSize;
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
