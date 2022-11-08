import { Point } from "../../../types/geometry";
import { LogicalEdge, Node, PartialClusterNode } from "../../../types/graph";
import PartialGraph from "./PartialGraph";

/**
 * Returns the clusterNode that has the given id.
 */
export function getClusterNode(
  this: PartialGraph,
  id: number
): PartialClusterNode {
  const node = this.nodes.find((clusterNode) => clusterNode.id === id);
  if (!node) {
    throw new Error(`clusterNode with id ${id} doesn't exist`);
  }
  return node;
}

/**
 * Returns the node that has the given id. Optionally you can
 * specify the cluster that the node is in.
 */
export function getNode(
  this: PartialGraph,
  id: number,
  clusterNodeID?: number
): Node {
  if (clusterNodeID === undefined) {
    for (let clusterNode of this.nodes) {
      const match = clusterNode.subgraph.nodes.find((node) => node.id === id);
      if (match === undefined) continue;
      return match;
    }
    throw new Error(`node with id ${id} doesn't exist`);
  } else {
    const node = this.getClusterNode(clusterNodeID)?.subgraph.nodes.find(
      (node) => node.id === id
    );
    if (!node) {
      throw new Error(
        `node with id ${id} and clusterNode id ${clusterNodeID} doesn't exist`
      );
    }
    return node;
  }
}

/**
 * Returns the clusterNodeID of the clusterNode that contains the node with
 * the given nodeID.
 */
export function getClusterNodeID(this: PartialGraph, nodeID: number): number {
  for (let clusterNode of this.nodes) {
    const match = clusterNode.subgraph.nodes.find((node) => node.id === nodeID);
    if (match === undefined) continue;
    return clusterNode.id;
  }
  throw new Error(`node with id ${nodeID} doesn't exist`);
}

/**
 * Computes the absolute position of the node that has the given id.
 */
export function getAbsoluteNodePosition(this: PartialGraph, id: number): Point {
  for (let clusterNode of this.nodes) {
    const node = clusterNode.subgraph.nodes.find((node) => node.id === id);
    if (node === undefined) continue;
    return {
      x: clusterNode.x + node.x,
      y: clusterNode.y + node.y,
    };
  }
  throw new Error(`node with id ${id} doesn't exist`);
}

/**
 * Removes the node with the given id and all edges that are connect to it.
 * If the node is in a singleton cluster, the entire cluster is removed.
 */
export function removeNode(this: PartialGraph, nodeID: number) {
  for (let i = 0; i < this.nodes.length; i++) {
    const clusterNode = this.nodes[i];
    const nodes = clusterNode.subgraph.nodes;

    for (let j = 0; j < nodes.length; j++) {
      const node = nodes[j];
      if (node.id === nodeID) {
        nodes.splice(j, 1);
        clusterNode.subgraph.edges = clusterNode.subgraph.edges.filter(
          (edge) => edge.source !== nodeID && edge.target !== nodeID
        );
        if (nodes.length === 0) {
          this.removeClusterNode(clusterNode.id);
        }
        return;
      }
    }
  }
}

/**
 * Removes the cluster node with the given id and all edges that are connect to it.
 */
export function removeClusterNode(this: PartialGraph, nodeID: number) {
  for (let i = 0; i < this.nodes.length; i++) {
    if (this.nodes[i].id === nodeID) {
      this.nodes.splice(i, 1);
      this.edges = this.edges.filter(
        (edge) => edge.source !== nodeID && edge.target !== nodeID
      );
      return;
    }
  }
}

/**
 * Computes and aggregates all edges between the given node and all other nodes grouped by
 * their cluster (edges from nodes in the same cluster are aggregated). This can
 * be used to find new cluster edges when creating a new cluster.
 * @returns A map where each key is the clusterNodeID and the value is the aggregated value
 * of all edge values to nodes in that cluster
 */
export function computeClusterEdges(
  this: PartialGraph,
  nodeID: number
): Map<number, number> {
  return this.logicalGraph.edges.reduce((value, edge) => {
    if (
      (edge.source !== nodeID && edge.target !== nodeID) ||
      edge.source === edge.target
    )
      return value;
    const clusterNodeID =
      edge.source === nodeID
        ? this.getClusterNodeID(edge.target)
        : this.getClusterNodeID(edge.source);
    if (value.has(clusterNodeID)) {
      value.set(clusterNodeID, value.get(clusterNodeID)! + edge.value);
    } else {
      value.set(clusterNodeID, edge.value);
    }
    return value;
  }, new Map<number, number>());
}

/**
 * Computes all edges between the given node and all other nodes in the given cluster.
 */
export function computeSubgraphEdges(
  this: PartialGraph,
  nodeID: number,
  clusterNodeID: number
): LogicalEdge[] {
  const clusterNode = this.getClusterNode(clusterNodeID);
  const nodesInCluster = new Set(
    clusterNode.subgraph.nodes.map((node) => node.id)
  );

  return this.logicalGraph.edges.reduce((edges, edge) => {
    if (
      (edge.source !== nodeID && edge.target !== nodeID) ||
      edge.source === edge.target
    )
      return edges;

    const otherNodeID = edge.source !== nodeID ? edge.source : edge.target;
    if (nodesInCluster.has(otherNodeID)) {
      edges.push({
        source: nodeID,
        target: otherNodeID,
        value: edge.value,
      });
    }
    return edges;
  }, [] as LogicalEdge[]);
}
