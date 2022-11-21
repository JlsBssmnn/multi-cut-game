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
  clusterNode.borderColor =
    this.theme.getTransparentColor("clusterBorderColor");
  clusterNode.color = this.theme.getColor("tempClusterColor");

  clusterNode.subgraph.nodes.forEach((node) => {
    // duplicate nodes with white color such that you
    // can't see the edges below the nodes
    node.color = "white";

    clusterNode.subgraph.nodes.push({
      ...node,
      color: this.theme.getTransparentColor("nodeColor"),
    });
  });
  clusterNode.subgraph.edges.forEach(
    (edge) => (edge.opacity = this.theme.opacity)
  );

  // enlarge the other cluster (the number of nodes for the first cluster must
  // be divided by 2 because we introduced the white duplicates for each node)
  const otherClusterNode = this.getClusterNode(destinationClusterID);
  this.changeClusterSize(
    otherClusterNode,
    clusterNode.subgraph.nodes.length / 2 +
      otherClusterNode.subgraph.nodes.length
  );

  // remove cluster edges
  this.edges = this.edges.filter(
    (edge) => edge.source !== clusterNodeID && edge.target !== clusterNodeID
  );

  // change the cluster edges of the destination cluster
  // this is done by computing the additional costs that arise when the nodes
  // of the origin cluster are joined to the destination cluster
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
      return;
    }
    edge.value += newValue;
    edge.opacity = this.theme.opacity;
    newEdges.delete(otherClusterID);
  });

  // add new edges for connections between clusterX to the dragged
  // cluster where there is no connection between that clusterX
  // and the destination cluster
  Array.from(newEdges.entries()).forEach(([otherClusterID, value]) => {
    if (otherClusterID === destinationClusterID) return;
    this.edges.push({
      source: destinationClusterID,
      target: otherClusterID,
      value,
      opacity: this.theme.opacity,
    });
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
  clusterNode.borderColor = this.theme.getColor("clusterBorderColor");
  clusterNode.color = this.theme.getColor("clusterNodeColor");
  clusterNode.subgraph.nodes.forEach(
    (node) => (node.color = this.theme.getColor("nodeColor"))
  );
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
