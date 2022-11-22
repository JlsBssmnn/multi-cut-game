import { Point } from "../../../../types/geometry";
import {
  pointInSquare,
  squaresIntersect,
} from "../../../calculations/geometry";
import { connectedComponents } from "../../../calculations/graphCalculations";
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
      // this action is valid if there is an edge that connects a node
      // in one cluster to a node in the other cluster
      const sourceNodes = new Set(
        clusterNode.subgraph.nodes.map((node) => node.id)
      );
      const targetNodes = new Set(
        otherCluster.subgraph.nodes.map((node) => node.id)
      );
      const valid = this.logicalGraph.edges.some(
        (edge) =>
          (sourceNodes.has(edge.source) && targetNodes.has(edge.target)) ||
          (targetNodes.has(edge.source) && sourceNodes.has(edge.target))
      );
      return {
        name: "joinClusters",
        destinationClusterID: otherCluster.id,
        valid,
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

  // get connected components of the subgraph of the dragged node
  // when this node is removed and check that there is only 1
  const newSubgraph = {
    nodes: originClusterNode.subgraph.nodes
      .filter((node) => node.id !== nodeID)
      .map((node) => ({ ...node, group: originClusterNodeID })),
    edges: originClusterNode.subgraph.edges.filter(
      (edge) => edge.source !== nodeID && edge.target !== nodeID
    ),
  };
  const validMoveOut = connectedComponents(newSubgraph).length === 1;

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
      const nodesInNewCluster = new Set(
        otherClusterNode.subgraph.nodes.map((node) => node.id)
      );
      const validInNewCluster = this.logicalGraph.edges.some(
        (edge) =>
          (edge.source === nodeID && nodesInNewCluster.has(edge.target)) ||
          (nodesInNewCluster.has(edge.source) && edge.target === nodeID)
      );
      return {
        name: "moveToCluster",
        destinationClusterID: otherClusterNode.id,
        valid: validMoveOut && validInNewCluster,
      };
    }
  }

  // move the node into a singleton
  return {
    name: "moveOut",
    valid: validMoveOut,
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
