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

  const { clusterNode } = this.dragEvent;
  const { destinationCluster } = this.dragEvent.action;

  // make the dragged cluster transparent
  clusterNode.borderColor =
    this.theme.getTransparentColor("clusterBorderColor");
  clusterNode.color = this.theme.getColor("tempClusterColor");

  clusterNode.subgraph.nodes.forEach((node) => {
    node.color = this.theme.getTransparentColor("nodeColor");
  });
  clusterNode.subgraph.edges.forEach(
    (edge) => (edge.opacity = this.theme.opacity)
  );

  // enlarge the other cluster
  this.changeClusterSize(
    destinationCluster,
    clusterNode.subgraph.nodes.length + destinationCluster.subgraph.nodes.length
  );

  // remove cluster edges
  this.edges = this.edges.filter(
    (edge) => edge.source !== clusterNode.id && edge.target !== clusterNode.id
  );

  // change the cluster edges of the destination cluster
  // this is done by computing the additional costs that arise when the nodes
  // of the origin cluster are joined to the destination cluster
  const newEdges = this.computeClusterEdges(clusterNode.id);
  this.edges.forEach((edge) => {
    if (
      edge.source !== destinationCluster.id &&
      edge.target !== destinationCluster.id
    )
      return;
    const otherClusterID =
      edge.source !== destinationCluster.id ? edge.source : edge.target;

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
    if (otherClusterID === destinationCluster.id) return;
    this.edges.push({
      source: destinationCluster.id,
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

  const { clusterNode } = this.dragEvent;
  const { destinationCluster } = this.dragEvent.action;

  // make the dragged cluster opaque
  clusterNode.borderColor = this.theme.getColor("clusterBorderColor");
  clusterNode.color = this.theme.getColor("clusterNodeColor");
  clusterNode.subgraph.nodes.forEach(
    (node) => (node.color = this.theme.getColor("nodeColor"))
  );
  clusterNode.subgraph.edges.forEach((edge) => (edge.opacity = 1));

  // reset the size of the other cluster
  this.changeClusterSize(
    destinationCluster,
    destinationCluster.subgraph.nodes.length
  );

  // update the cluster edges
  this.updateClusterEdges(clusterNode.id, false);
  this.updateClusterEdges(destinationCluster.id, false);
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
  const { originClusterNode, action } = this.dragEvent;
  const { destinationCluster } = action;

  const smallerID = Math.min(originClusterNode.id, destinationCluster.id);

  // delete the dragged cluster node
  this.nodes.splice(this.nodes.indexOf(originClusterNode), 1);

  // because the new cluster gets the id of the cluster with the smallest id,
  // change the id of the destination cluster to that minimum
  if (destinationCluster.id > smallerID) {
    this.edges.forEach((edge) => {
      if (edge.source === destinationCluster.id) {
        edge.source = smallerID;
      } else if (edge.target === destinationCluster.id) {
        edge.target = smallerID;
      }
    });
  }
  destinationCluster.id = smallerID;

  this.updateClusterNode(smallerID);
  this.makeOpaque();
}
