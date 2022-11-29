import { Point } from "../../types/geometry";
import { Node, PartialClusterNode } from "../../types/graph";
import { ClusterAction, NodeAction } from "./Action";

export class DragEvent {
  /**
   * The cluster that is dragged or the cluster that
   * contains the node that is dragged.
   */
  clusterNode: PartialClusterNode;

  /**
   * The value of `clusterNode` when the event was created.
   */
  originClusterNode: PartialClusterNode;

  /**
   * The distance from the dragged node's origin to the pointer.
   */
  pointerOffset: Point;

  constructor(clusterNode: PartialClusterNode, pointerOffset: Point) {
    this.clusterNode = clusterNode;
    this.originClusterNode = clusterNode;
    this.pointerOffset = pointerOffset;
  }
}

export class ClusterDragEvent extends DragEvent {
  /**
   * The action that would be executed if the pointerOut event
   * would fire. This object also contains information that is
   * necessary to undo this action.
   */
  action: ClusterAction = {
    name: "reposition",
  };

  constructor(clusterNode: PartialClusterNode, pointerOffset: Point) {
    super(clusterNode, pointerOffset);
  }
}

export class NodeDragEvent extends DragEvent {
  /**
   * The node in the cluster that is dragged. 
   */
  node: Node;

  /**
   * the relative position of the pointer within the node that is
   * currently dragged, thus the position is relative to the node itself.
   */
  relativeNodePosition: Point;

  /**
   * Same as for the `ClusterDragEvent`
   */
  action: NodeAction = {
    name: "reposition",
  };

  constructor(
    clusterNode: PartialClusterNode,
    pointerOffset: Point,
    node: Node,
    relativeNodePosition: Point
  ) {
    super(clusterNode, pointerOffset);
    this.node = node;
    this.relativeNodePosition = relativeNodePosition;
  }
}
