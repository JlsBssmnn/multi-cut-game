import { Point } from "../../../../types/geometry";
import { NodeDragEvent } from "../../DragEvent";
import PartialGraph from "../PartialGraph";

export function visualizeJoinClusters(
  this: PartialGraph,
  pointerPosition: Point
) {
  if (
    this.dragEvent == null ||
    this.dragEvent instanceof NodeDragEvent ||
    this.dragEvent.action.name !== "joinClusters"
  ) {
    throw new Error(
      "visualizeJoinClusters was called even though the joinClusters action \
			wasn't represented by the drag event"
    );
  }

  const { clusterNodeID } = this.dragEvent;
  const { destinationClusterID } = this.dragEvent.action;

  // make the dragged cluster transparent
  const clusterNode = this.getClusterNode(clusterNodeID);
  clusterNode.borderColor = `rgba(0,0,0,${this.opacity})`;
  clusterNode.color = "white";
  clusterNode.subgraph.nodes.forEach((node) => {
    node.color = "white";

    // duplicate nodes with white color such that you
    // can't see the edges below the nodes
    clusterNode.subgraph.nodes.push({
      ...node,
      color: `rgba(0,0,0,${this.opacity})`,
    });
  });
  clusterNode.subgraph.edges.forEach((edge) => (edge.opacity = this.opacity));

  // enlarge the other cluster
  const otherClusterNode = this.getClusterNode(destinationClusterID);
  this.changeClusterSize(
    otherClusterNode,
    clusterNode.subgraph.nodes.length + otherClusterNode.subgraph.nodes.length
  );

  // remove cluster edges
  this.edges = this.edges.filter(
    (edge) => edge.source !== clusterNodeID && edge.target !== clusterNodeID
  );

  // change the cluster edges of the destination cluster
  const newEdges = this.computeClusterEdges(clusterNodeID);
  this.edges.forEach((edge) => {
    if (
      edge.source !== destinationClusterID &&
      edge.target !== destinationClusterID
    )
      return;
    const otherClusterID =
      edge.source !== destinationClusterID ? edge.source : edge.target;

    const newValue = newEdges.get(otherClusterID);
    if (newValue === undefined) {
      throw new Error(
        "There was an edge that connects nodes that are not in the node set"
      );
    }
    edge.value += newValue;
    edge.opacity = this.opacity;
  });
}

export function unvisualizeJoinClusters(
  this: PartialGraph,
  pointerPosition: Point
) {
  if (
    this.dragEvent == null ||
    this.dragEvent instanceof NodeDragEvent ||
    this.dragEvent.action.name !== "joinClusters"
  ) {
    throw new Error(
      "visualizeJoinClusters was called even though the joinClusters action \
			wasn't represented by the drag event"
    );
  }

  const { clusterNodeID } = this.dragEvent;
  const { destinationClusterID } = this.dragEvent.action;

  // make the dragged cluster opaque
  const clusterNode = this.getClusterNode(clusterNodeID);
  clusterNode.borderColor = "black";
  clusterNode.color = "rgb(224 235 245)";
  clusterNode.subgraph.nodes.forEach((node) => (node.color = "black"));
  clusterNode.subgraph.edges.forEach((edge) => (edge.opacity = 1));

  // remove duplicate nodes
  const seenNodes = new Set();
  clusterNode.subgraph.nodes = clusterNode.subgraph.nodes.filter((node) => {
    if (seenNodes.has(node.id)) return false;
    seenNodes.add(node.id);
    return true;
  });

  // reset the size of the other cluster
  const otherClusterNode = this.getClusterNode(destinationClusterID);
  this.changeClusterSize(
    otherClusterNode,
    otherClusterNode.subgraph.nodes.length
  );

  // update the cluster edges
  this.updateClusterEdges(clusterNodeID, false);
  this.updateClusterEdges(destinationClusterID, false);
}

export function commitJoinClusters(this: PartialGraph) {
  if (
    this.dragEvent == null ||
    this.dragEvent instanceof NodeDragEvent ||
    this.dragEvent.action.name !== "joinClusters"
  ) {
    throw new Error(
      "commitJoinClusters was called even though the joinClusters action \
			wasn't represented by the drag event"
    );
  }
  const { originClusterNodeID, action } = this.dragEvent;
  const { destinationClusterID } = action;

  const smallerID = Math.min(originClusterNodeID, destinationClusterID);

  const orgClusterNode = this.getClusterNode(originClusterNodeID);
  const destClusterNode = this.getClusterNode(destinationClusterID);

  // delete the dragged cluster node
  this.nodes.splice(this.nodes.indexOf(orgClusterNode), 1);

  // because the new cluster gets the id of the cluster with the smallest id,
  // change the id of the destination cluster to that minimum
  if (destClusterNode.id > smallerID) {
    this.edges.forEach((edge) => {
      if (edge.source === destClusterNode.id) {
        edge.source = smallerID;
      } else if (edge.target === destClusterNode.id) {
        edge.target = smallerID;
      }
    });
  }
  destClusterNode.id = smallerID;

  this.updateClusterNode(smallerID);
  this.makeOpaque();
}
