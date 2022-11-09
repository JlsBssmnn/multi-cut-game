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

  const { originClusterNodeID, nodeID } = this.dragEvent;

  this.removeNode(nodeID);
  const maxClusterID = Math.max(...this.nodes.map((node) => node.id));
  const offset = clusterOffset(1, this.nodeSize);

  // add the new cluster
  this.nodes.push({
    color: "white",
    id: maxClusterID + 1,
    size: clusterDiameter(1, this.nodeSize),
    x: pointerPosition.x,
    y: pointerPosition.y,
    borderColor: `rgba(0,0,0,${this.opacity})`,
    subgraph: {
      nodes: [
        {
          x: offset,
          y: offset,
          size: this.nodeSize,
          color: `rgba(0,0,0,${this.opacity})`,
          id: nodeID,
        },
      ],
      edges: [],
    },
  });

  // update the cluster edges
  this.updateClusterEdges(originClusterNodeID, true);
  this.updateClusterEdges(maxClusterID + 1, true);

  // update the drag event
  this.dragEvent.clusterNodeID = maxClusterID + 1;
  const relativePosition = this.dragEvent.relativeNodePosition;
  this.dragEvent.pointerOffset = {
    x: offset + relativePosition.x,
    y: offset + relativePosition.y,
  };

  // store that the new cluster is just temporary
  this.temporaryCluster = maxClusterID + 1;
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

  const { nodeID, originClusterNodeID, relativeNodePosition } = this.dragEvent;

  this.removeNode(nodeID);

  // move node to it's old cluster
  const clusterNode = this.getClusterNode(originClusterNodeID);
  clusterNode.subgraph.nodes.push({
    x: pointerPosition.x - clusterNode.x - relativeNodePosition.x,
    y: pointerPosition.y - clusterNode.y - relativeNodePosition.y,
    size: this.nodeSize,
    color: "black",
    id: nodeID,
  });

  // add back edges in the subgraph
  clusterNode.subgraph.edges.push(
    ...this.computeSubgraphEdges(nodeID, originClusterNodeID)
  );

  // update the cluster edges of the origin cluster
  this.updateClusterEdges(originClusterNodeID, false);

  // update the drag event
  this.dragEvent.clusterNodeID = originClusterNodeID;
  const relativePosition = this.dragEvent.relativeNodePosition;
  this.dragEvent.pointerOffset = {
    x: clusterNode.x + relativePosition.x,
    y: clusterNode.y + relativePosition.y,
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
  this.updateClusterNode(this.dragEvent.originClusterNodeID);

  // reset temporary cluster
  this.temporaryCluster = null;
}
