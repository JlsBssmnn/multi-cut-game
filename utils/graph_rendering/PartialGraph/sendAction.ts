import { copyObject } from "../../utils";
import { ClusterDragEvent } from "../DragEvent";
import PartialGraph from "./PartialGraph";

/**
 * This function applies the action which is represented by the current `dragEvent`.
 * This means that the visualization is updated (so transparent parts of the graph
 * are made opaque) and the logical graph is changed. The new logical graph is also
 * passed to the react setter that was used to instantiate this class.
 */
export function sendAction(this: PartialGraph) {
  if (this.dragEvent == null) return this;

  const action = this.dragEvent.action;
  if (action.name !== "reposition" && !action.valid) {
    if (this.lastStates.length === 0)
      throw new Error(
        "There was an invalid action, but the" +
          " last valid state wasn't stored!"
      );
    const lastState = this.lastStates.pop()!;
    this.nodes = lastState.nodes;
    this.edges = lastState.edges;
    this.dragEvent = null;
    this.temporaryCluster = null;
    return copyObject(this);
  }

  if (this.dragEvent instanceof ClusterDragEvent) {
    const { originClusterNodeID, action } = this.dragEvent;
    if (action.name === "joinClusters") {
      this.applyJoinClusters(originClusterNodeID, action.destinationClusterID);
      this.commitJoinClusters();
    }
  } else {
    const { nodeID, action, clusterNodeID } = this.dragEvent;
    if (action.name === "moveOut") {
      this.applyMoveOut(nodeID, clusterNodeID);
      this.commitMoveOut();
    } else if (action.name === "moveToCluster") {
      this.applyMoveToCluster(nodeID, clusterNodeID);
      this.commitMoveToCluster();
    }
  }

  // necessary to fire the useEffect in the `InteractiveGraph`
  this.logicalGraph = copyObject(this.logicalGraph);

  this.dragEvent = null;
  return copyObject(this);
}

export function applyMoveOut(
  this: PartialGraph,
  nodeID: number,
  newClusterID: number
) {
  const node = this.logicalGraph.nodes.find((node) => node.id == nodeID);
  if (node === undefined) {
    throw new Error(
      `Tried to move out node with id ${nodeID}, but the node doesn't exist`
    );
  }
  node.group = newClusterID;
}

export function applyMoveToCluster(
  this: PartialGraph,
  nodeID: number,
  group: number
) {
  const node = this.logicalGraph.nodes.find((node) => node.id == nodeID);
  if (node === undefined) {
    throw new Error(`Tried to move node with id ${nodeID} to cluster ${group}, but the
										node doesn't exist`);
  }
  node.group = group;
}

export function applyJoinClusters(
  this: PartialGraph,
  group1: number,
  group2: number
) {
  if (group1 > group2) {
    [group1, group2] = [group2, group1];
  }
  this.logicalGraph.nodes.forEach((node) => {
    if (node.group === group2) {
      node.group = group1;
    }
  });
}
