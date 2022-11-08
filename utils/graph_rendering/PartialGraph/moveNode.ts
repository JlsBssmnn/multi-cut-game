import { Point } from "../../../types/geometry";
import { copyObject } from "../../utils";
import { differentActions } from "../Action";
import { ClusterDragEvent } from "../DragEvent";
import PartialGraph from "./PartialGraph";

/**
 * Returns a new instance of `PartiallyRenderedGraph` where the node positions
 * are adjusted to the pointer position depending on the provided `DraggedNode`.
 */
export function moveNode(
  this: PartialGraph,
  pointerPosition: Point
): PartialGraph {
  if (this.dragEvent == null) return this;

  const action = this.dragEvent.action;
  const newAction = this.getAction(pointerPosition);

  if (differentActions(action, newAction)) {
    this.unvisualizeAction(action, pointerPosition);
    this.dragEvent.action = this.completeAction(newAction);
    this.visualizeAction(this.dragEvent.action, pointerPosition);
  }

  const { clusterNodeID, pointerOffset } = this.dragEvent;

  const clusterNode = this.getClusterNode(clusterNodeID);
  if (
    this.dragEvent instanceof ClusterDragEvent ||
    clusterNode.subgraph.nodes.length === 1
  ) {
    clusterNode.x = pointerPosition.x - pointerOffset.x;
    clusterNode.y = pointerPosition.y - pointerOffset.y;
  } else {
    const nodeID = this.dragEvent.nodeID;
    const node = this.getNode(nodeID, clusterNodeID);

    node.x = pointerPosition.x - pointerOffset.x;
    node.y = pointerPosition.y - pointerOffset.y;
  }

  return copyObject(this);
}
