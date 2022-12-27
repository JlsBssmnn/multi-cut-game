import {
  ClusterEdge,
  LogicalEdge,
  LogicalGraph,
  PartialClusterNode,
} from "../../../types/graph";
import { Layout } from "../../graph_layout/LayoutAlgorithms";
import { ClusterDragEvent, NodeDragEvent } from "../DragEvent";
import PartialGraphTheme from "../PartialGraphTheme";
import { restoreOriginClusterNode, splitCluster } from "./actions/common";
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
  undoAction,
  scaleGraphRelative,
  copyState,
  scaleWholeGraph,
  getHintedEdge,
  fixClusterOverlap,
} from "./helpers";
import { moveNode } from "./moveNode";
import { nodeAt } from "./nodeAt";
import {
  applyJoinClusters,
  applyMoveToCluster,
  applyMoveOut,
  sendAction,
} from "./sendAction";

export interface GraphState {
  nodes: PartialClusterNode[];
  edges: ClusterEdge[];
  logicalGraph: LogicalGraph;
}

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
  edges: ClusterEdge[];

  logicalGraph: LogicalGraph;
  nodeSize: number;
  theme: PartialGraphTheme;
  layout: Layout;

  dragEvent: ClusterDragEvent | NodeDragEvent | null = null;

  /**
   * Holds the clusterNodeID of a cluster that was created for visualizing/previewing
   * an action, but the cluster doesn't actually exist in the actual clustering.
   */
  temporaryCluster: number | null = null;

  /**
   * Holds a list of clusterNodes that were created because a connecting node was
   * moved outside of a cluster and thus split it into multiple parts.
   */
  temporarySplitClusters: PartialClusterNode[] = [];

  /**
   * A history of valid states throughout the playthrough of the game. This is
   * used to reset the graph when the user performs an invalid action or when
   * the user wants to undo an action.
   */
  lastStates: GraphState[] = [];

  constructor(
    nodes: PartialClusterNode[],
    edges: LogicalEdge[],
    logicalGraph: LogicalGraph,
    nodeSize: number,
    theme: PartialGraphTheme,
    layout: Layout
  ) {
    this.nodes = nodes;
    this.logicalGraph = logicalGraph;
    this.nodeSize = nodeSize;
    this.theme = theme;
    this.layout = layout;

    const nodeMap = new Map<number, PartialClusterNode>();
    this.nodes.forEach((node) => nodeMap.set(node.id, node));
    this.edges = edges.map((edge) => {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);
      if (!source || !target)
        throw new Error(
          "Inconsisten graph provided: edges contain" +
            " nodes that don't exist in the node list"
        );
      return {
        source,
        target,
        value: edge.value,
      };
    });
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
  undoAction = undoAction;
  scaleGraphRelative = scaleGraphRelative;
  copyState = copyState;
  scaleWholeGraph = scaleWholeGraph;
  getHintedEdge = getHintedEdge;
  fixClusterOverlap = fixClusterOverlap;

  splitCluster = splitCluster;
  restoreOriginClusterNode = restoreOriginClusterNode;

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
