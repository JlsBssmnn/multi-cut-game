import { ClusterDragEvent } from "../DragEvent";
import PartialGraph from "./PartialGraph";

/**
 * This function applies the action which is represented by the current `dragEvent`.
 * This means that the visualization is updated (so transparent parts of the graph
 * are made opaque) and the logical graph is changed. The new logical graph is also
 * passed to the react setter that was used to instantiate this class.
 */
export function sendAction(this: PartialGraph) {
  if (this.dragEvent == null) return;

  const action = this.dragEvent.action;
  if (action.name !== "reposition" && !action.valid) {
    const lastState = this.lastStates.pop();
    if (!lastState)
      throw new Error(
        "There was an invalid action, but the last valid state wasn't stored!"
      );
    this.nodes = lastState.nodes;
    this.edges = lastState.edges;
    this.dragEvent = null;
    this.temporaryCluster = null;
    return;
  }

  if (this.dragEvent instanceof ClusterDragEvent) {
    const { originClusterNode, action } = this.dragEvent;
    if (action.name === "joinClusters") {
      this.applyJoinClusters(
        originClusterNode.id,
        action.destinationCluster.id
      );
      this.commitJoinClusters();
    }
  } else {
    const { node, action, clusterNode } = this.dragEvent;
    if (action.name === "moveOut") {
      this.applyMoveOut(node.id, clusterNode.id);
      this.commitMoveOut();
    } else if (action.name === "moveToCluster") {
      this.applyMoveToCluster(node.id, clusterNode.id);
      this.commitMoveToCluster();
    }
  }

  this.dragEvent = null;
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

  // if the cluster was split, update the groups of all involved nodes
  if (this.temporarySplitClusters.length > 0) {
    this.temporarySplitClusters.forEach((cluster) => {
      cluster.subgraph.nodes.forEach((node) => {
        const logicalNode = this.logicalGraph.nodes.find(
          (lNode) => lNode.id == node.id
        );
        if (logicalNode === undefined) {
          throw new Error(
            `Tried to move out node with id ${nodeID}, but the node doesn't exist`
          );
        }
        logicalNode.group = cluster.id;
      });
    });
  }
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

  // if the cluster was split, update the groups of all involved nodes
  if (this.temporarySplitClusters.length > 0) {
    this.temporarySplitClusters.forEach((cluster) => {
      cluster.subgraph.nodes.forEach((node) => {
        const logicalNode = this.logicalGraph.nodes.find(
          (lNode) => lNode.id == node.id
        );
        if (logicalNode === undefined) {
          throw new Error(
            `Tried to move out node with id ${nodeID}, but the node doesn't exist`
          );
        }
        logicalNode.group = cluster.id;
      });
    });
  }
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
