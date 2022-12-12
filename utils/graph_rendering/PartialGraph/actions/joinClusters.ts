import { Point } from "../../../../types/geometry";
import { PartialSubgraph, Node } from "../../../../types/graph";
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

  // create a subgraph that represents the join
  const joinPreview: PartialSubgraph = {
    nodes: [
      ...clusterNode.subgraph.nodes,
      ...destinationCluster.subgraph.nodes,
    ],
    edges: [],
  };
  const joinPreviewMap = new Map<number, Node>();
  joinPreview.nodes.forEach((node) => joinPreviewMap.set(node.id, node));

  joinPreview.edges = this.logicalGraph.edges
    .filter(
      (edge) =>
        joinPreviewMap.has(edge.source) && joinPreviewMap.has(edge.target)
    )
    .map((edge) => ({
      source: joinPreviewMap.get(edge.source)!,
      target: joinPreviewMap.get(edge.target)!,
      value: edge.value,
    }));

  // enlarge the other cluster
  this.changeClusterSize(destinationCluster, joinPreview);

  // remove cluster edges
  this.edges = this.edges.filter(
    (edge) => edge.source !== clusterNode && edge.target !== clusterNode
  );

  // change the cluster edges of the destination cluster
  // this is done by computing the additional costs that arise when the nodes
  // of the origin cluster are joined to the destination cluster
  const newEdges = this.computeClusterEdges(clusterNode.id);
  this.edges.forEach((edge) => {
    if (
      edge.source !== destinationCluster &&
      edge.target !== destinationCluster
    )
      return;
    const otherCluster =
      edge.source !== destinationCluster ? edge.source : edge.target;

    const newValue = newEdges.get(otherCluster);
    if (newValue === undefined) {
      return;
    }
    edge.value += newValue;
    edge.opacity = this.theme.opacity;
    newEdges.delete(otherCluster);
  });

  // add new edges for connections between clusterX to the dragged
  // cluster where there is no connection between that clusterX
  // and the destination cluster
  Array.from(newEdges.entries()).forEach(([otherCluster, value]) => {
    if (otherCluster === destinationCluster) return;
    this.edges.push({
      source: destinationCluster,
      target: otherCluster,
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
  this.changeClusterSize(destinationCluster);

  // update the cluster edges
  this.updateClusterEdges([clusterNode, destinationCluster], false);
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
  destinationCluster.id = smallerID;

  this.updateClusterNode(destinationCluster);
  this.makeOpaque();
}
