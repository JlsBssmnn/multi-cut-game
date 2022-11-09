import { Point } from "../../../../types/geometry";
import { clusterDiameter } from "../../../calculations/geometry";
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

  // restore cluster edges
  const previousEdges = this.computeClusterEdges(clusterNodeID);
  Array.from(previousEdges.entries()).forEach(([otherClusterID, value]) => {
    this.edges.push({
      source: clusterNodeID,
      target: otherClusterID,
      value: value,
    });
  });

  // reset the cluster edges of the destination cluster
  const newEdges = this.computeClusterEdges(destinationClusterID);
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
    edge.value = newValue;
    edge.opacity = 1;
  });
}
