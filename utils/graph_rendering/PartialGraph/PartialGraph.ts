import { SignalHandlers } from "../../../react_components/InteractiveGraph";
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
import { unvisualizeMoveOut, visualizeMoveOut } from "./actions/moveOut";
import {
  computeClusterEdges,
  computeSubgraphEdges,
  getClusterNode,
  getClusterNodeID,
  getNode,
  getNodeAbsolutePosition,
  removeClusterNode,
  removeNode,
} from "./helpers";
import { moveNode } from "./moveNode";
import { nodeAt } from "./nodeAt";
import { sendAction } from "./sendAction";

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
  dragEvent: ClusterDragEvent | NodeDragEvent | null = null;
  signalHandlers!: SignalHandlers;
  nodeSize: number;
  opacity: number;

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

  // helpers
  getClusterNode = getClusterNode;
  getNode = getNode;
  getNodeAbsolutePosition = getNodeAbsolutePosition;
  getClusterNodeID = getClusterNodeID;
  removeNode = removeNode;
  removeClusterNode = removeClusterNode;
  computeClusterEdges = computeClusterEdges;
  computeSubgraphEdges = computeSubgraphEdges;

  // the 3 main stages
  nodeAt = nodeAt;
  moveNode = moveNode;
  sendAction = sendAction;

  // everything concerning actions and how to display them
  // helpers
  getAction = getAction;
  protected handleClusterMove = handleClusterMove;
  protected handleNodeMove = handleNodeMove;
  completeAction = completeAction;

  // visualizting
  unvisualizeAction = unvisualizeAction;
  visualizeAction = visualizeAction;
  visualizeMoveOut = visualizeMoveOut;
  unvisualizeMoveOut = unvisualizeMoveOut;
}
