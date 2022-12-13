import { Point } from "../../../../types/geometry";
import { clusterDiameter, clusterOffset } from "../../../calculations/geometry";
import { ClusterDragEvent } from "../../DragEvent";
import PartialGraph from "../PartialGraph";

export function visualizeMoveOut(this: PartialGraph, pointerPosition: Point) {
  if (
    this.dragEvent == null ||
    this.dragEvent instanceof ClusterDragEvent ||
    this.dragEvent.action.name !== "moveOut"
  ) {
    throw new Error(
      "visualizeMoveOut was called even though the moveOut action wasn't \
			represented by the drag event"
    );
  }

  const { originClusterNode, node } = this.dragEvent;

  this.removeNode(node);
  const maxClusterID = Math.max(...this.nodes.map((node) => node.id));
  const newClusterID = maxClusterID + 1;

  // add the new cluster
  const newNode = {
    id: node.id,
    x: 0,
    y: 0,
    color: this.theme.getTransparentColor("nodeColor"),
    size: this.nodeSize,
    group: newClusterID,
  };
  const newCluster = {
    color: this.theme.getColor("tempClusterColor"),
    id: newClusterID,
    size: 0,
    x: pointerPosition.x,
    y: pointerPosition.y,
    borderColor: this.theme.getTransparentColor("clusterBorderColor"),
    subgraph: {
      nodes: [newNode],
      edges: [],
    },
  };
  const subgraphSize = this.layout.computeSubgraphSize(
    this,
    newCluster.subgraph
  );
  const offset = clusterOffset(subgraphSize);
  const diameter = clusterDiameter(subgraphSize);

  newNode.x = offset;
  newNode.y = offset;
  newCluster.size = diameter;
  this.nodes.push(newCluster);

  // split the origin cluster into parts if the removed node was a
  // connecting piece
  this.splitCluster(originClusterNode, newClusterID + 1);

  // update the cluster edges if cluster wasn't split
  if (this.temporarySplitClusters.length === 0) {
    this.updateClusterEdges([originClusterNode, newCluster], true);
  } else {
    this.updateClusterEdges([...this.temporarySplitClusters, newCluster], true);
  }

  // update the drag event
  this.dragEvent.clusterNode = newCluster;
  this.dragEvent.node = newNode;
  const relativePosition = this.dragEvent.relativeNodePosition;
  this.dragEvent.pointerOffset = {
    x: offset + relativePosition.x,
    y: offset + relativePosition.y,
  };

  // store that the new cluster is just temporary
  this.temporaryCluster = newClusterID;
}

export function unvisualizeMoveOut(this: PartialGraph, pointerPosition: Point) {
  if (
    this.dragEvent == null ||
    this.dragEvent instanceof ClusterDragEvent ||
    this.dragEvent.action.name !== "moveOut"
  ) {
    throw new Error(
      "unvisualizeMoveOut was called even though the moveOut action wasn't \
			represented by the drag event"
    );
  }

  const { node, originClusterNode, relativeNodePosition } = this.dragEvent;

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
  this.restoreOriginClusterNode();

  // update the cluster edges of the origin cluster
  this.updateClusterEdges([originClusterNode], false);

  // update the drag event (the node attribute was updated by
  // restoreOriginClusterNode())
  this.dragEvent.clusterNode = originClusterNode;
  const relativePosition = this.dragEvent.relativeNodePosition;
  this.dragEvent.pointerOffset = {
    x: originClusterNode.x + relativePosition.x,
    y: originClusterNode.y + relativePosition.y,
  };

  // reset temporary cluster
  this.temporaryCluster = null;
}

export function commitMoveOut(this: PartialGraph) {
  if (
    this.dragEvent == null ||
    this.dragEvent instanceof ClusterDragEvent ||
    this.dragEvent.action.name !== "moveOut"
  ) {
    throw new Error(
      "commitMoveOut was called even though the moveOut action wasn't \
			represented by the drag event"
    );
  }
  this.makeOpaque();
  this.updateClusterNode(this.dragEvent.originClusterNode);

  // reset temporary cluster
  this.temporaryCluster = null;
}
