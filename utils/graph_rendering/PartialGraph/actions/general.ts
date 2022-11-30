import { Point } from "../../../../types/geometry";
import { Node, PartialClusterNode } from "../../../../types/graph";
import { circlesIntersect } from "../../../calculations/geometry";
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
    const { originClusterNode } = this.dragEvent;
    return this.handleClusterMove(originClusterNode);
  } else {
    const { originClusterNode, node } = this.dragEvent;
    return this.handleNodeMove(originClusterNode, node);
  }
}

export function handleClusterMove(
  this: PartialGraph,
  clusterNode: PartialClusterNode
): Action {
  for (let i = 0; i < this.nodes.length; i++) {
    const otherCluster = this.nodes[i];
    if (
      otherCluster.id !== clusterNode.id &&
      circlesIntersect(
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
        destinationCluster: otherCluster,
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
  originClusterNode: PartialClusterNode,
  node: Node
): Action {
  // The absolute position of the node within the entire visualization
  const absolutePosition = this.getAbsoluteNodePosition(node);

  // the node is still inside the cluster
  if (
    circlesIntersect(
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
      .filter((otherNode) => otherNode !== node)
      .map((node) => ({ id: node.id, group: originClusterNode.id })),
    edges: originClusterNode.subgraph.edges
      .filter((edge) => edge.source !== node && edge.target !== node)
      .map((edge) => ({
        source: edge.source.id,
        target: edge.target.id,
        value: edge.value,
      })),
  };
  const validMoveOut = connectedComponents(newSubgraph).length === 1;

  // check for collision with clusters
  for (let i = 0; i < this.nodes.length; i++) {
    const otherClusterNode = this.nodes[i];
    if (otherClusterNode.id === this.temporaryCluster) continue;
    if (
      circlesIntersect(
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
          (edge.source === node.id && nodesInNewCluster.has(edge.target)) ||
          (nodesInNewCluster.has(edge.source) && edge.target === node.id)
      );
      return {
        name: "moveToCluster",
        destinationCluster: otherClusterNode,
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
