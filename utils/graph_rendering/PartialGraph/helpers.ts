import { Point } from "../../../types/geometry";
import { LogicalEdge, Node, PartialClusterNode } from "../../../types/graph";
import {
  clusterDiameter,
  clusterGraphSize,
  clusterOffset,
} from "../../calculations/geometry";
import { layoutCluster } from "../../graph_layout/layoutGraph";
import { scaleLayout } from "../../graph_layout/scaleGraph";
import { copyObject } from "../../utils";
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
 * Computes the edges between the given cluster node and all other cluster nodes
 * (values of the edges are the aggregated values of all edges connecting nodes from
 * the first cluster to the second).
 * @returns A map where each key is the clusterNodeID and the value is the aggregated value
 * of all edge values to nodes in that cluster
 */
export function computeClusterEdges(
  this: PartialGraph,
  clusterNodeID: number
): Map<number, number> {
  const nodeToCluster = new Map<number, number>();
  this.nodes.forEach((clusterNode) => {
    clusterNode.subgraph.nodes.forEach((node) => {
      nodeToCluster.set(node.id, clusterNode.id);
    });
  });

  return this.logicalGraph.edges.reduce((value, edge) => {
    const sourceCluster = nodeToCluster.get(edge.source);
    const targetCluster = nodeToCluster.get(edge.target);
    if (sourceCluster === undefined || targetCluster === undefined) {
      throw new Error(
        "Partial graph contains edges that connect not-existing nodes"
      );
    }
    if (
      (sourceCluster !== clusterNodeID && targetCluster !== clusterNodeID) ||
      sourceCluster === targetCluster
    ) {
      return value;
    }
    const otherClusterNodeID =
      sourceCluster === clusterNodeID ? targetCluster : sourceCluster;
    if (value.has(otherClusterNodeID)) {
      value.set(
        otherClusterNodeID,
        value.get(otherClusterNodeID)! + edge.value
      );
    } else {
      value.set(otherClusterNodeID, edge.value);
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

/**
 * Changes the size of the given cluster node such that there is enough
 * space to fit in the given number of nodes
 */
export function changeClusterSize(
  this: PartialGraph,
  clusterNode: PartialClusterNode,
  numOfNodes: number
) {
  const newSize = clusterDiameter(numOfNodes, this.nodeSize);
  const positionChange = (clusterNode.size - newSize) / 2;

  clusterNode.size = newSize;
  clusterNode.x += positionChange;
  clusterNode.y += positionChange;

  clusterNode.subgraph.nodes.forEach((node) => {
    node.x -= positionChange;
    node.y -= positionChange;
  });
}

/**
 * Removes all edges involving the given cluster and recomputes
 * their value. The edges are then added either transparent (if the
 * corresponding parameter is true) or opaque.
 */
export function updateClusterEdges(
  this: PartialGraph,
  clusterNodeID: number,
  transparent: boolean
) {
  this.edges = this.edges.filter(
    (edge) => edge.source !== clusterNodeID && edge.target !== clusterNodeID
  );
  const updatedEdges = this.computeClusterEdges(clusterNodeID);
  Array.from(updatedEdges.entries()).forEach(([otherClusterID, value]) => {
    this.edges.push({
      source: clusterNodeID,
      target: otherClusterID,
      value: value,
      opacity: transparent ? this.theme.opacity : undefined,
    });
  });
}

/**
 * Loops through all parts of the graph and makes them opaque
 */
export function makeOpaque(this: PartialGraph) {
  for (const edge of this.edges) {
    if (edge.opacity !== undefined) {
      delete edge.opacity;
    }
  }

  for (const clusterNode of this.nodes) {
    if (clusterNode.borderColor !== undefined) {
      clusterNode.borderColor = this.theme.getColor("clusterBorderColor");
      clusterNode.color = this.theme.getColor("clusterNodeColor");
    }

    for (const node of clusterNode.subgraph.nodes) {
      node.color = this.theme.getColor("nodeColor");
    }
    for (const edge of clusterNode.subgraph.edges) {
      if (edge.opacity !== undefined) {
        delete edge.opacity;
      }
    }
  }
}

/**
 * Updates the given cluster node such that it represents the information
 * which is currently held by the logical graph. This includes resizing the
 * node, updating the subgraph as well as layout the subgraph again.
 */
export function updateClusterNode(this: PartialGraph, clusterNodeID: number) {
  const nodesInCluster = new Set();
  this.logicalGraph.nodes.forEach((node) => {
    if (node.group === clusterNodeID) {
      nodesInCluster.add(node.id);
    }
  });
  const clusterNode = this.getClusterNode(clusterNodeID);

  // resize the cluster node
  this.changeClusterSize(clusterNode, nodesInCluster.size);

  // re-layout the subgraph
  const nodes = this.logicalGraph.nodes
    .filter((node) => node.group === clusterNodeID)
    .map((node) => ({ ...node }));
  const edges = this.logicalGraph.edges
    .filter(
      (edge) =>
        nodesInCluster.has(edge.source) && nodesInCluster.has(edge.target)
    )
    .map((edge) => ({ ...edge }));

  const renderedCluster = layoutCluster(
    { nodes, edges },
    this.nodeSize,
    this.theme
  );

  const innerRecSize = clusterGraphSize(nodesInCluster.size, this.nodeSize);
  const offset = clusterOffset(nodesInCluster.size, this.nodeSize);

  scaleLayout(renderedCluster.nodes, innerRecSize, innerRecSize);
  renderedCluster.nodes.forEach((node) => {
    node.x += offset;
    node.y += offset;
  });

  clusterNode.subgraph = renderedCluster;
}

/**
 * Undoes the last action by popping the latest stored state and setting
 * the appropriate properties on the graph. If there is no previous state
 * this function will do nothing.
 * @returns A copy of the changed graph
 */
export function undoAction(this: PartialGraph): PartialGraph {
  const lastState = this.lastStates.pop();
  if (!lastState) return copyObject(this);

  this.nodes = lastState.nodes;
  this.edges = lastState.edges;
  this.logicalGraph = lastState.logicalGraph;
  this.dragEvent = null;
  this.temporaryCluster = null;
  return copyObject(this);
}
