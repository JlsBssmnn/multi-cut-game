import { SignalHandlers } from "../../react_components/InteractiveGraph";
import { Point } from "../../types/geometry";
import {
  LogicalEdge,
  LogicalGraph,
  Node,
  PartialClusterNode,
} from "../../types/graph";
import { pointInSquare, squaresIntersect } from "../calculations/geometry";
import { copyObject } from "../utils";
import DragEvent from "./DragEvent";

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
  dragEvent: DragEvent | null = null;
  signalHandlers!: SignalHandlers;

  constructor(
    nodes: PartialClusterNode[],
    edges: LogicalEdge[],
    logicalGraph: LogicalGraph
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.logicalGraph = logicalGraph;
  }

  /**
   * Calculates which node is at the specified position as well as
   * the offset of the position to the node. The information is returned
   * as `DraggedNode`.
   */
  nodeAt(position: Point): PartialGraph {
    let clusterNode: PartialClusterNode | null = null;
    let node: Node | null = null;
    let clusterNodeIdx, nodeIdx;

    // check for collision with clusters
    for (let i = 0; i < this.nodes.length; i++) {
      clusterNode = this.nodes[i];

      if (pointInSquare(position, clusterNode, clusterNode.size)) {
        clusterNodeIdx = i;
        const subgraph = clusterNode.subgraph;

        if (subgraph.nodes.length < 2) {
          // if the cluster is a singleton, then select the entire cluster
          break;
        }

        // check for collision with nodes inside the cluster
        for (let j = 0; j < subgraph.nodes.length; j++) {
          node = subgraph.nodes[j];
          const nodePosition = {
            x: node.x + clusterNode.x,
            y: node.y + clusterNode.y,
          };

          if (pointInSquare(position, nodePosition, node.size)) {
            nodeIdx = j;
            break;
          }
        }
        break;
      }
    }

    if (clusterNodeIdx == null) {
      return copyObject(this);
    }
    const selectedNodeX = nodeIdx === undefined ? clusterNode!.x : node!.x;
    const selectedNodeY = nodeIdx === undefined ? clusterNode!.y : node!.y;

    const pointerOffset = {
      x: position.x - selectedNodeX,
      y: position.y - selectedNodeY,
    };

    this.dragEvent = new DragEvent(clusterNodeIdx, pointerOffset, nodeIdx);
    return copyObject(this);
  }

  /**
   * Returns a new instance of `PartiallyRenderedGraph` where the node positions
   * are adjusted to the pointer position depending on the provided `DraggedNode`.
   */
  moveNode(pointerPosition: Point): PartialGraph {
    if (this.dragEvent == null) return this;

    const { clusterNodeID, pointerOffset, nodeID } = this.dragEvent;

    if (nodeID === undefined) {
      this.nodes[clusterNodeID].x = pointerPosition.x - pointerOffset.x;
      this.nodes[clusterNodeID].y = pointerPosition.y - pointerOffset.y;
    } else {
      this.nodes[clusterNodeID].subgraph.nodes[nodeID].x =
        pointerPosition.x - pointerOffset.x;
      this.nodes[clusterNodeID].subgraph.nodes[nodeID].y =
        pointerPosition.y - pointerOffset.y;
    }

    return copyObject(this);
  }

  /**
   * This function checks the given `draggedNode` and decides which action
   * is represented by it. It then calls the correct function from `signalHandlers`
   * that is meant for handling this action.
   */
  sendAction() {
    if (this.dragEvent == null) return;
    const { clusterNodeID, nodeID } = this.dragEvent;

    if (nodeID === undefined) {
      this.handleClusterMove(clusterNodeID);
    } else {
      this.handleNodeMove(clusterNodeID, nodeID);
    }
  }

  private handleClusterMove(clusterNodeID: number) {
    const cluster = this.nodes[clusterNodeID];
    for (let i = 0; i < this.nodes.length; i++) {
      const otherCluster = this.nodes[i];
      if (
        i !== clusterNodeID &&
        squaresIntersect(cluster, otherCluster, cluster.size, otherCluster.size)
      ) {
        this.signalHandlers.joinClusters(cluster.id, otherCluster.id);
        return;
      }
    }
  }

  private handleNodeMove(clusterNodeID: number, nodeID: number) {
    const clusterNode = this.nodes[clusterNodeID];
    const node = clusterNode.subgraph.nodes[nodeID];

    // The absolute position of the node within the entire visualization
    const absolutePosition = {
      x: node.x + clusterNode.x,
      y: node.y + clusterNode.y,
    };

    // the node is still inside the cluster
    if (pointInSquare(absolutePosition, clusterNode, clusterNode.size)) return;

    // check for collision with clusters
    for (let i = 0; i < this.nodes.length; i++) {
      const otherClusterNode = this.nodes[i];
      if (
        pointInSquare(absolutePosition, otherClusterNode, otherClusterNode.size)
      ) {
        this.signalHandlers.moveNodeToCluster(node.id, otherClusterNode.id);
        return;
      }
    }

    // move the node into a singleton
    this.signalHandlers.removeNodeFromCluster(node.id);
  }
}
