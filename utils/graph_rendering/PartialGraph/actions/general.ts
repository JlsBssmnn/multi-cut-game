import { Point } from "../../../../types/geometry";
import {
  pointInSquare,
  squaresIntersect,
} from "../../../calculations/geometry";
import { Action } from "../../Action";
import { ClusterDragEvent } from "../../DragEvent";
import PartialGraph from "../PartialGraph";

/**
 * Computes which action is currently represented by the pointerPosition.
 * If the current `dragEvent` is null, this function returns null.
 */
export function getAction(this: PartialGraph, pointerPosition: Point): Action {
  if (this.dragEvent == null)
    throw new Error("Cannot get action if drag event is null");

  if (this.dragEvent instanceof ClusterDragEvent) {
    const { originClusterNodeID } = this.dragEvent;
    return this.handleClusterMove(originClusterNodeID);
  } else {
    const { originClusterNodeID, nodeID } = this.dragEvent;
    return this.handleNodeMove(originClusterNodeID, nodeID);
  }
}

export function handleClusterMove(
  this: PartialGraph,
  clusterNodeID: number
): Action {
  const clusterNode = this.getClusterNode(clusterNodeID);
  for (let i = 0; i < this.nodes.length; i++) {
    const otherCluster = this.nodes[i];
    if (
      otherCluster.id !== clusterNodeID &&
      squaresIntersect(
        clusterNode,
        otherCluster,
        clusterNode.size,
        otherCluster.size
      )
    ) {
      return {
        name: "joinClusters",
        destinationClusterID: otherCluster.id,
      };
    }
  }
  return {
    name: "reposition",
  };
}

export function handleNodeMove(
  this: PartialGraph,
  originClusterNodeID: number,
  nodeID: number
): Action {
  // a node is dragged
  const originClusterNode = this.getClusterNode(originClusterNodeID);

  // The absolute position of the node within the entire visualization
  const absolutePosition = this.getAbsoluteNodePosition(nodeID);

  // the node is still inside the cluster
  if (
    squaresIntersect(
      absolutePosition,
      originClusterNode,
      this.nodeSize,
      originClusterNode.size
    )
  )
    return {
      name: "reposition",
    };

  // check for collision with clusters
  for (let i = 0; i < this.nodes.length; i++) {
    const otherClusterNode = this.nodes[i];
    if (otherClusterNode.id === this.temporaryCluster) continue;
    if (
      squaresIntersect(
        absolutePosition,
        otherClusterNode,
        this.nodeSize,
        otherClusterNode.size
      )
    ) {
      return {
        name: "moveToCluster",
        destinationClusterID: otherClusterNode.id,
      };
    }
  }

  // move the node into a singleton
  return {
    name: "moveOut",
  };
}

/**
 * Removes all the visual stuff that was added to show the given action,
 * such that the represented action after this method is reposition.
 */
export function unvisualizeAction(
  this: PartialGraph,
  action: Action,
  pointerPosition: Point
) {
  switch (action.name) {
    case "reposition":
      return;
    case "moveOut":
      this.unvisualizeMoveOut(pointerPosition);
      break;
    case "moveToCluster":
      this.unvisualizeMoveToCluster(pointerPosition);
      break;
    case "joinClusters":
      this.unvisualizeJoinClusters(pointerPosition);
      break;
  }
}

/**
 * Change the `PartialGraph` in such a way that the given action is
 * indicated to the user by the visualization of the graph.
 */
export function visualizeAction(
  this: PartialGraph,
  action: Action,
  pointerPosition: Point
) {
  switch (action.name) {
    case "reposition":
      return;
    case "moveOut":
      this.visualizeMoveOut(pointerPosition);
      break;
    case "moveToCluster":
      this.visualizeMoveToCluster(pointerPosition);
      break;
    case "joinClusters":
      this.visualizeJoinClusters(pointerPosition);
      break;
  }
}
