import { Node, PartialClusterNode } from "../../../../types/graph";
import { clusterDiameter, clusterOffset } from "../../../calculations/geometry";
import { connectedComponents } from "../../../calculations/graphCalculations";
import { NodeDragEvent } from "../../DragEvent";
import PartialGraph from "../PartialGraph";

/**
 * Takes a cluster node and creates new cluster nodes that are appended to the
 * nodes of the partial graph. Every node represents one connected component of
 * the subgraph of the provided cluster node. (This function can be called when
 * the subgraph of a cluster node is not connected anymore). The idCounter is
 * the id that the cluster's ids will start with.
 *
 * Note that new edges will not be added for these clusters, this must be done
 * manually.
 */
export function splitCluster(
  this: PartialGraph,
  clusterNode: PartialClusterNode,
  idCounter: number
): void {
  const newSubgraph = {
    nodes: clusterNode.subgraph.nodes.map((node) => ({
      id: node.id,
      group: clusterNode.id,
    })),
    edges: clusterNode.subgraph.edges.map((edge) => ({
      source: edge.source.id,
      target: edge.target.id,
      value: edge.value,
    })),
  };
  const components = connectedComponents(newSubgraph);
  const splitClusters = [];

  if (components.length === 1) {
    return;
  }

  while (components.length > 0) {
    const nodeIDs = new Set(components.pop()!.map((node) => node.id));

    // create new cluster
    const cluster = {
      color: this.theme.getColor("tempClusterColor"),
      id: idCounter,
      size: 0,
      x: 0,
      y: 0,
      borderColor: this.theme.getTransparentColor("clusterBorderColor"),
      subgraph: {
        nodes: clusterNode.subgraph.nodes.filter((node) =>
          nodeIDs.has(node.id)
        ),
        edges: clusterNode.subgraph.edges.filter(
          (edge) => nodeIDs.has(edge.source.id) && nodeIDs.has(edge.target.id)
        ),
      },
    };

    // compute size of cluster
    const subgraphSize = this.layout.computeSubgraphSize(
      this,
      cluster.subgraph
    );
    const diameter = clusterDiameter(subgraphSize);
    cluster.size = diameter;

    // position cluster
    const subgraphNodes = cluster.subgraph.nodes.length;
    let [avgX, avgY] = cluster.subgraph.nodes.reduce(
      ([sumX, sumY], node) => {
        // also update the group and color attribute of every node
        node.group = idCounter;
        node.color = this.theme.getTransparentColor("nodeColor");
        return [sumX + node.x, sumY + node.y];
      },
      [0, 0]
    );
    avgX = avgX / subgraphNodes + this.nodeSize / 2;
    avgY = avgY / subgraphNodes + this.nodeSize / 2;

    cluster.x = clusterNode.x + avgX - diameter / 2;
    cluster.y = clusterNode.y + avgY - diameter / 2;

    // make edges transparent
    cluster.subgraph.edges.forEach((edge) => {
      edge.opacity = this.theme.opacity;
    });

    // layout subgraph
    this.layout.subgraphLayout(this, cluster.subgraph);
    this.layout.scaleSubgraph(
      cluster.subgraph.nodes,
      subgraphSize,
      subgraphSize,
      0
    );
    const offset = clusterOffset(subgraphSize);
    cluster.subgraph.nodes.forEach((node) => {
      node.x += offset;
      node.y += offset;
    });

    splitClusters.push(cluster);
    idCounter++;
  }

  this.removeClusterNode(clusterNode.id);
  this.nodes.push(...splitClusters);
  this.temporarySplitClusters = splitClusters;
}

/**
 * Removes all temporary split cluster nodes and merges their content
 * back to the origin cluster node. It also lays out the content of that
 * cluster again. The given node is the node which was moved back into
 * the origin cluster.
 */
export function restoreOriginClusterNode(this: PartialGraph, node: Node) {
  if (!this.dragEvent) {
    throw new Error("Cannot restore origin cluster node if drag event is null");
  }

  const clusterNode = this.dragEvent.originClusterNode;

  if (this.temporarySplitClusters.length > 0) {
    // remove the split clusters from the node array and add back
    // the origin cluster
    this.temporarySplitClusters.forEach((cluster) => {
      this.nodes.splice(
        this.nodes.findIndex((node) => node === cluster),
        1
      );
    });
    // remove the edges involving any split cluster
    this.edges = this.edges.filter(
      (edge) =>
        !this.temporarySplitClusters.includes(edge.source) &&
        !this.temporarySplitClusters.includes(edge.target)
    );

    this.nodes.push(clusterNode);
    this.updateClusterNode(clusterNode);
  } else {
    clusterNode.subgraph.edges.push(
      ...this.computeSubgraphEdges(node, clusterNode, false)
    );
  }

  if (this.dragEvent instanceof NodeDragEvent) {
    const dragEventNode = this.dragEvent.node;
    const newNode = clusterNode.subgraph.nodes.find(
      (node) => node.id === dragEventNode.id
    );
    if (!newNode) {
      throw new Error(
        "Dragged node was lost during restoration of origin cluster node"
      );
    }
    this.dragEvent.node = newNode;
  }

  this.temporarySplitClusters = [];
}
