import { Point } from "../../../../types/geometry";
import { ClusterDragEvent } from "../../DragEvent";
import PartialGraph from "../PartialGraph";

export function visualizeMoveToCluster(
  this: PartialGraph,
  pointerPosition: Point
) {
  if (
    this.dragEvent == null ||
    this.dragEvent instanceof ClusterDragEvent ||
    this.dragEvent.action.name !== "moveToCluster"
  ) {
    throw new Error(
      "visualizeMoveToCluster was called even though the moveToCluster action \
			wasn't represented by the drag event"
    );
  }

  const { action, node, relativeNodePosition, originClusterNode } =
    this.dragEvent;
  const { destinationCluster } = action;

  this.removeNode(node);

  // add the node to the other cluster and enlarge clusterNode
  const newNode = {
    id: node.id,
    x: destinationCluster.x + relativeNodePosition.x,
    y: destinationCluster.y + relativeNodePosition.y,
    color: this.theme.getTransparentColor("nodeColor"),
    size: this.nodeSize,
    group: destinationCluster.id,
  };
  destinationCluster.subgraph.nodes.push(newNode);
  this.changeClusterSize(
    destinationCluster,
    destinationCluster.subgraph.nodes.length
  );

  // add the new edges inside the cluster
  const newEdges = this.computeSubgraphEdges(newNode, destinationCluster, true);
  destinationCluster.subgraph.edges.push(...newEdges);

  // update the cluster edges
  this.updateClusterEdges(originClusterNode, true, destinationCluster.id);
  this.updateClusterEdges(destinationCluster, true);

  // update the drag event
  this.dragEvent.clusterNode = destinationCluster;
  this.dragEvent.node = newNode;
  this.dragEvent.pointerOffset = {
    x: destinationCluster.x + relativeNodePosition.x,
    y: destinationCluster.y + relativeNodePosition.y,
  };
}

export function unvisualizeMoveToCluster(
  this: PartialGraph,
  pointerPosition: Point
) {
  if (
    this.dragEvent == null ||
    this.dragEvent instanceof ClusterDragEvent ||
    this.dragEvent.action.name !== "moveToCluster"
  ) {
    throw new Error(
      "visualizeMoveToCluster was called even though the moveToCluster action \
			wasn't represented by the drag event"
    );
  }

  const {
    clusterNode: formerCluster,
    node,
    originClusterNode,
    relativeNodePosition,
  } = this.dragEvent;

  this.removeNode(node);

  // move node to it's old cluster
  const newNode = {
    id: node.id,
    x: pointerPosition.x - originClusterNode.x - relativeNodePosition.x,
    y: pointerPosition.y - originClusterNode.y - relativeNodePosition.y,
    color: this.theme.getColor("nodeColor"),
    size: this.nodeSize,
    group: originClusterNode.id,
  };
  originClusterNode.subgraph.nodes.push(newNode);

  // reset cluster size
  this.changeClusterSize(formerCluster, formerCluster.subgraph.nodes.length);

  // add back edges in the subgraph
  originClusterNode.subgraph.edges.push(
    ...this.computeSubgraphEdges(node, originClusterNode, false)
  );

  // update the cluster edges
  this.updateClusterEdges(originClusterNode, false);
  this.updateClusterEdges(formerCluster, false);

  // update the drag event
  this.dragEvent.clusterNode = originClusterNode;
  this.dragEvent.node = newNode;
  const relativePosition = this.dragEvent.relativeNodePosition;
  this.dragEvent.pointerOffset = {
    x: originClusterNode.x + relativePosition.x,
    y: originClusterNode.y + relativePosition.y,
  };
}

export function commitMoveToCluster(this: PartialGraph) {
  if (
    this.dragEvent == null ||
    this.dragEvent instanceof ClusterDragEvent ||
    this.dragEvent.action.name !== "moveToCluster"
  ) {
    throw new Error(
      "commitMoveToCluster was called even though the moveToCluster action wasn't \
			represented by the drag event"
    );
  }
  this.makeOpaque();
  this.updateClusterNode(this.dragEvent.originClusterNode);
  this.updateClusterNode(this.dragEvent.clusterNode);
}
