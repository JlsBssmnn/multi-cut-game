import {
  DraggedNode,
  SignalHandlers,
} from "../../react_components/InteractiveGraph";
import { Point } from "../../types/geometry";
import { LogicalEdge, Node, PartialClusterNode } from "../../types/graph";
import {
  clusterOffset,
  pointInSquare,
  squaresIntersect,
} from "../calculations/geometry";
import { copyObject } from "../utils";

/**
 * If the value is `'rerender'` this mean that the graph has changed it's
 * data and thus should be rerendered. Otherwise nothing changed.
 */
export type Rerender = "rerender" | null;

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

  constructor(nodes: PartialClusterNode[], edges: LogicalEdge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  /**
   * Calculates which node is at the specified position as well as
   * the offset of the position to the node. The information is returned
   * as `DraggedNode`.
   */
  nodeAt(position: Point): DraggedNode | null {
    let clusterNode: PartialClusterNode | null = null;
    let node: Node | null = null;
    let clusterNodeIdx, nodeIdx;

    // check for collision with clusters
    for (let i = 0; i < this.nodes.length; i++) {
      clusterNode = this.nodes[i];

      if (pointInSquare(position, clusterNode, clusterNode.size)) {
        clusterNodeIdx = i;
        const subgraph = clusterNode.subgraph;

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
      return null;
    }
    const selectedNodeX = nodeIdx === undefined ? clusterNode!.x : node!.x;
    const selectedNodeY = nodeIdx === undefined ? clusterNode!.y : node!.y;

    const pointerOffset = {
      x: position.x - selectedNodeX,
      y: position.y - selectedNodeY,
    };

    return {
      clusterNode: clusterNodeIdx,
      pointerOffset,
      node: nodeIdx,
    };
  }

  /**
   * Returns a new instance of `PartiallyRenderedGraph` where the node positions
   * are adjusted to the pointer position depending on the provided `DraggedNode`.
   */
  moveNode(pointerPosition: Point, draggedNode: DraggedNode): PartialGraph {
    const newGraph = copyObject(this);

    const { clusterNode, pointerOffset, node } = draggedNode;

    if (node === undefined) {
      newGraph.nodes[clusterNode].x = pointerPosition.x - pointerOffset.x;
      newGraph.nodes[clusterNode].y = pointerPosition.y - pointerOffset.y;
    } else {
      newGraph.nodes[clusterNode].subgraph!.nodes[node].x =
        pointerPosition.x - pointerOffset.x;
      newGraph.nodes[clusterNode].subgraph!.nodes[node].y =
        pointerPosition.y - pointerOffset.y;
    }

    return newGraph;
  }

  /**
   * This function checks the given `draggedNode` and decides which action
   * is represented by it. It then calls the correct function from `signalHandlers`
   * that is meant for handling this action.
   * @returns 'rerender' if the position of a node was changed without an action
   * dispatched (wich means the graph should be rerendered), otherwise returns `null`
   */
  sendAction(
    draggedNode: DraggedNode,
    signalHandlers: SignalHandlers
  ): Rerender {
    const { clusterNode, node } = draggedNode;

    if (node === undefined) {
      this.handleClusterMove(clusterNode, signalHandlers);
      return null;
    } else {
      return this.handleNodeMove(clusterNode, node, signalHandlers);
    }
  }

  private handleClusterMove(
    clusterNode: number,
    signalHandlers: SignalHandlers
  ) {
    const cluster = this.nodes[clusterNode];
    for (let i = 0; i < this.nodes.length; i++) {
      const otherCluster = this.nodes[i];
      if (
        i !== clusterNode &&
        squaresIntersect(cluster, otherCluster, cluster.size, otherCluster.size)
      ) {
        signalHandlers.joinClusters(
          parseInt(cluster.id),
          parseInt(otherCluster.id)
        );
        return;
      }
    }
  }

  private handleNodeMove(
    clusterNodeIdx: number,
    nodeIdx: number,
    signalHandlers: SignalHandlers
  ): Rerender {
    const clusterNode = this.nodes[clusterNodeIdx];
    const node = clusterNode.subgraph.nodes[nodeIdx];

    // The absolute position of the node within the entire visualization
    const absolutePosition = {
      x: node.x + clusterNode.x,
      y: node.y + clusterNode.y,
    };

    // the node is still inside the cluster
    if (pointInSquare(absolutePosition, clusterNode, clusterNode.size))
      return null;

    // check for collision with clusters
    for (let i = 0; i < this.nodes.length; i++) {
      const otherClusterNode = this.nodes[i];
      if (
        pointInSquare(absolutePosition, otherClusterNode, otherClusterNode.size)
      ) {
        signalHandlers.moveNodeToCluster(
          node.id,
          parseInt(otherClusterNode.id)
        );
        return null;
      }
    }

    // node is already in a singleton, so reset it's position
    // the rerender will not be caused automatically (that's why we
    // return 'rerender' here)
    if (clusterNode.subgraph!.nodes.length < 2) {
      const offset = clusterOffset(1, node.size);
      node.x = offset;
      node.y = offset;
      return "rerender";
    }

    // move the node into a singleton
    signalHandlers.removeNodeFromCluster(node.id);
    return null;
  }
}
