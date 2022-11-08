import { Point } from "../../types/geometry";
import { ClusterAction, NodeAction } from "./Action";

export class DragEvent {
  /**
   * The id of the cluster that is dragged or the id of cluster that
   * contains the node that is dragged.
   */
  clusterNodeID: number;

  /**
   * The value of `clusterNodeID` when the event was created.
   */
  originClusterNodeID: number;

  /**
   * The distance from the dragged node's origin to the pointer.
   */
  pointerOffset: Point;

  /**
   * The absolute position of the pointer when the event was created
   */
  originPointerPosition: Point;

  constructor(clusterNodeID: number, position: Point, pointerOffset: Point) {
    this.clusterNodeID = clusterNodeID;
    this.originClusterNodeID = clusterNodeID;
    this.pointerOffset = pointerOffset;
    this.originPointerPosition = position;
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

  constructor(clusterNodeID: number, position: Point, pointerOffset: Point) {
    super(clusterNodeID, position, pointerOffset);
  }
}

export class NodeDragEvent extends DragEvent {
  /**
   * The id of the node in the cluster that is dragged. If no
   * node in the cluster but just the cluster is dragged this
   * is undefined.
   */
  nodeID: number;

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
    clusterNodeID: number,
    position: Point,
    pointerOffset: Point,
    nodeID: number,
    relativeNodePosition: Point
  ) {
    super(clusterNodeID, position, pointerOffset);
    this.nodeID = nodeID;
    this.relativeNodePosition = relativeNodePosition;
  }
}
