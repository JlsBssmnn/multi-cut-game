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

  const { action, nodeID, relativeNodePosition, originClusterNodeID } =
    this.dragEvent;
  const { destinationClusterID } = action;

  this.removeNode(nodeID);

  // add the node to the other cluster and enlarge clusterNode
  const clusterNode = this.getClusterNode(destinationClusterID);
  this.changeClusterSize(clusterNode, clusterNode.subgraph.nodes.length + 1);
  clusterNode.subgraph.nodes.push({
    x: clusterNode.x + relativeNodePosition.x,
    y: clusterNode.y + relativeNodePosition.y,
    size: this.nodeSize,
    color: `rgba(0,0,0,${this.opacity})`,
    id: nodeID,
  });

  // add the new edges inside the cluster
  const newEdges = this.computeSubgraphEdges(nodeID, destinationClusterID);
  newEdges.forEach((edge) => (edge.opacity = this.opacity));
  clusterNode.subgraph.edges.push(...newEdges);

  // update the cluster edges
  this.updateClusterEdges(originClusterNodeID, true);
  this.updateClusterEdges(destinationClusterID, true);

  // update the drag event
  this.dragEvent.clusterNodeID = destinationClusterID;
  this.dragEvent.pointerOffset = {
    x: clusterNode.x + relativeNodePosition.x,
    y: clusterNode.y + relativeNodePosition.y,
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

  const { clusterNodeID, nodeID, originClusterNodeID, relativeNodePosition } =
    this.dragEvent;

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

  // reset cluster size
  const formerCluster = this.getClusterNode(clusterNodeID);
  this.changeClusterSize(formerCluster, formerCluster.subgraph.nodes.length);

  // add back edges in the subgraph
  clusterNode.subgraph.edges.push(
    ...this.computeSubgraphEdges(nodeID, originClusterNodeID)
  );

  // update the cluster edges
  this.updateClusterEdges(originClusterNodeID, false);
  this.updateClusterEdges(clusterNodeID, false);

  // update the drag event
  this.dragEvent.clusterNodeID = originClusterNodeID;
  const relativePosition = this.dragEvent.relativeNodePosition;
  this.dragEvent.pointerOffset = {
    x: clusterNode.x + relativePosition.x,
    y: clusterNode.y + relativePosition.y,
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
  this.updateClusterNode(this.dragEvent.originClusterNodeID);
  this.updateClusterNode(this.dragEvent.clusterNodeID);
}
