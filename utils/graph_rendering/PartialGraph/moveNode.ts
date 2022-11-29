import { Point } from "../../../types/geometry";
import { differentActions } from "../Action";
import { ClusterDragEvent } from "../DragEvent";
import PartialGraph from "./PartialGraph";

/**
 * Returns a new instance of `PartiallyRenderedGraph` where the node positions
 * are adjusted to the pointer position depending on the provided `DraggedNode`.
 */
export function moveNode(this: PartialGraph, pointerPosition: Point) {
  if (this.dragEvent == null) return;

  const action = this.dragEvent.action;
  const newAction = this.getAction(pointerPosition);

  if (differentActions(action, newAction)) {
    this.unvisualizeAction(action, pointerPosition);
    this.dragEvent.action = newAction;
    this.visualizeAction(this.dragEvent.action, pointerPosition);
  }

  const { clusterNode, pointerOffset } = this.dragEvent;

  if (
    this.dragEvent instanceof ClusterDragEvent ||
    clusterNode.subgraph.nodes.length === 1
  ) {
    clusterNode.x = pointerPosition.x - pointerOffset.x;
    clusterNode.y = pointerPosition.y - pointerOffset.y;
  } else {
    const { node } = this.dragEvent;

    node.x = pointerPosition.x - pointerOffset.x;
    node.y = pointerPosition.y - pointerOffset.y;
  }
}
