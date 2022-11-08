import { ClusterDragEvent } from "../DragEvent";
import PartialGraph from "./PartialGraph";

/**
 * This function checks the given `draggedNode` and decides which action
 * is represented by it. It then calls the correct function from `signalHandlers`
 * that is meant for handling this action.
 */
export function sendAction(this: PartialGraph) {
  if (this.dragEvent == null) return;

  if (this.dragEvent instanceof ClusterDragEvent) {
    const { originClusterNodeID, action } = this.dragEvent;
    switch (action.name) {
      case "joinClusters":
        this.signalHandlers.joinClusters(
          originClusterNodeID,
          action.destinationClusterID
        );
        break;
      case "reposition":
        break;
    }
  } else {
    const { nodeID, action } = this.dragEvent;
    switch (action.name) {
      case "moveOut":
        this.signalHandlers.removeNodeFromCluster(nodeID!);
        break;
      case "moveToCluster":
        this.signalHandlers.moveNodeToCluster(
          nodeID!,
          action.destinationClusterID
        );
        break;
      case "reposition":
        break;
    }
  }
}
