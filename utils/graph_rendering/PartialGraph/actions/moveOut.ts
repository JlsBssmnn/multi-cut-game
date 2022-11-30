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
  const offset = clusterOffset(1, this.nodeSize);

  // add the new cluster
  const newNode = {
    id: node.id,
    x: offset,
    y: offset,
    color: this.theme.getTransparentColor("nodeColor"),
    size: this.nodeSize,
    group: newClusterID,
  };
  const newCluster = {
    color: this.theme.getColor("tempClusterColor"),
    id: newClusterID,
    size: clusterDiameter(1, this.nodeSize),
    x: pointerPosition.x,
    y: pointerPosition.y,
    borderColor: this.theme.getTransparentColor("clusterBorderColor"),
    subgraph: {
      nodes: [newNode],
      edges: [],
    },
  };
  this.nodes.push(newCluster);

  // update the cluster edges
  this.updateClusterEdges(originClusterNode.id, true, newClusterID);
  this.updateClusterEdges(newClusterID, true);

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

  // add back edges in the subgraph
  originClusterNode.subgraph.edges.push(
    ...this.computeSubgraphEdges(node.id, originClusterNode, false)
  );

  // update the cluster edges of the origin cluster
  this.updateClusterEdges(originClusterNode.id, false);

  // update the drag event
  this.dragEvent.clusterNode = originClusterNode;
  this.dragEvent.node = newNode;
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
  this.updateClusterNode(this.dragEvent.originClusterNode.id);

  // reset temporary cluster
  this.temporaryCluster = null;
}
