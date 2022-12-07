import { Point } from "../../../types/geometry";
import { Edge, Node, PartialClusterNode } from "../../../types/graph";
import {
  clusterDiameter,
  clusterGraphSize,
  clusterOffset,
} from "../../calculations/geometry";
import {
  GraphDimensions,
  scaleLayout,
  scaleRelative,
} from "../../graph_layout/scaleGraph";
import { getSubgraph } from "./createPartialGraph";
import PartialGraph, { GraphState } from "./PartialGraph";

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
  clusterNode?: PartialClusterNode
): Node {
  if (clusterNode === undefined) {
    for (let clusterNode of this.nodes) {
      const match = clusterNode.subgraph.nodes.find((node) => node.id === id);
      if (match === undefined) continue;
      return match;
    }
    throw new Error(`node with id ${id} doesn't exist`);
  } else {
    const node = clusterNode.subgraph.nodes.find((node) => node.id === id);
    if (!node) {
      throw new Error(
        `node with id ${id} and clusterNode id ${clusterNode.id} doesn't exist`
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
 * Computes the absolute position of the given node.
 */
export function getAbsoluteNodePosition(this: PartialGraph, node: Node): Point {
  const clusterNode = this.nodes.find(
    (clusterNode) => clusterNode.id === node.group
  );
  if (!clusterNode) {
    throw new Error(`cluster node with id ${node.id} doesn't exist`);
  }
  return {
    x: clusterNode.x + node.x,
    y: clusterNode.y + node.y,
  };
}

/**
 * Removes the given node and all edges that are connect to it.
 * If the node is in a singleton cluster, the entire cluster is removed.
 */
export function removeNode(this: PartialGraph, node: Node) {
  const clusterNode = this.getClusterNode(node.group);

  const nodes = clusterNode.subgraph.nodes;
  nodes.splice(nodes.indexOf(node), 1);

  clusterNode.subgraph.edges = clusterNode.subgraph.edges.filter(
    (edge) => edge.source !== node && edge.target !== node
  );
  if (nodes.length === 0) {
    this.removeClusterNode(clusterNode.id);
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
        (edge) => edge.source.id !== nodeID && edge.target.id !== nodeID
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
): Map<PartialClusterNode, number> {
  const nodeToCluster = new Map<number, PartialClusterNode>();
  this.nodes.forEach((clusterNode) => {
    clusterNode.subgraph.nodes.forEach((node) => {
      nodeToCluster.set(node.id, clusterNode);
    });
  });

  return this.logicalGraph.edges.reduce((values, edge) => {
    const sourceCluster = nodeToCluster.get(edge.source);
    const targetCluster = nodeToCluster.get(edge.target);
    if (sourceCluster === undefined || targetCluster === undefined) {
      throw new Error(
        "Partial graph contains edges that connect not-existing nodes"
      );
    }
    if (
      (sourceCluster.id !== clusterNodeID &&
        targetCluster.id !== clusterNodeID) ||
      sourceCluster === targetCluster
    ) {
      return values;
    }
    const otherClusterNode =
      sourceCluster.id === clusterNodeID ? targetCluster : sourceCluster;
    if (values.has(otherClusterNode)) {
      values.set(otherClusterNode, values.get(otherClusterNode)! + edge.value);
    } else {
      values.set(otherClusterNode, edge.value);
    }
    return values;
  }, new Map<PartialClusterNode, number>());
}

/**
 * Computes all edges between the given node and all other nodes in the given cluster.
 * The edges are made transparent if the parameter is set to `true`.
 */
export function computeSubgraphEdges(
  this: PartialGraph,
  node: Node,
  clusterNode: PartialClusterNode,
  transparent: boolean
): Edge[] {
  return this.logicalGraph.edges.reduce((edges, edge) => {
    if (
      (edge.source !== node.id && edge.target !== node.id) ||
      edge.source === edge.target
    )
      return edges;

    const otherNodeID = edge.source !== node.id ? edge.source : edge.target;
    const otherNode = clusterNode.subgraph.nodes.find(
      (node) => node.id === otherNodeID
    );
    if (!otherNode) {
      return edges;
    }

    if (otherNode.group === node.group) {
      const newEdge: Edge = {
        source: node,
        target: otherNode,
        value: edge.value,
      };
      if (transparent) {
        newEdge.opacity = this.theme.opacity;
      }
      edges.push(newEdge);
    }
    return edges;
  }, [] as Edge[]);
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
 * Recomputes the edges involving the given cluster and updates
 * their value. The edges with changed value are then added either
 * transparent (if the corresponding parameter is true) or opaque.
 * If ignoredClusterID is provided, edges involing this cluster
 * will not be updated or changed in any way.
 */
export function updateClusterEdges(
  this: PartialGraph,
  clusterNode: PartialClusterNode,
  transparent: boolean,
  ignoredClusterID?: number
) {
  const previousValues = new Map<number, number>();
  this.edges = this.edges.filter((edge) => {
    const keep =
      (edge.source !== clusterNode && edge.target !== clusterNode) ||
      edge.source.id === ignoredClusterID ||
      edge.target.id === ignoredClusterID;

    if (keep) return keep;

    const otherCluster =
      edge.source !== clusterNode ? edge.source : edge.target;
    previousValues.set(otherCluster.id, edge.value);
    return keep;
  });
  const updatedEdges = this.computeClusterEdges(clusterNode.id);
  Array.from(updatedEdges.entries()).forEach(([otherCluster, value]) => {
    if (otherCluster.id === ignoredClusterID) return;

    const t = transparent && value !== previousValues.get(otherCluster.id);
    this.edges.push({
      source: clusterNode,
      target: otherCluster,
      value: value,
      opacity: t ? this.theme.opacity : undefined,
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
export function updateClusterNode(
  this: PartialGraph,
  clusterNode: PartialClusterNode
) {
  const newSubgraph = getSubgraph(
    this.logicalGraph,
    this.nodeSize,
    this.theme,
    clusterNode.id
  );
  const nodeCount = newSubgraph.nodes.length;

  // resize the cluster node
  this.changeClusterSize(clusterNode, nodeCount);

  // re-layout the subgraph
  this.layoutAlgorithm(newSubgraph, this.nodeSize);

  const innerRecSize = clusterGraphSize(nodeCount, this.nodeSize);
  const offset = clusterOffset(nodeCount, this.nodeSize);

  scaleLayout(newSubgraph.nodes, innerRecSize, innerRecSize);
  newSubgraph.nodes.forEach((node) => {
    node.x += offset;
    node.y += offset;
  });

  clusterNode.subgraph = newSubgraph;
}

/**
 * Undoes the last action by popping the latest stored state and setting
 * the appropriate properties on the graph. If there is no previous state
 * this function will do nothing.
 */
export function undoAction(this: PartialGraph) {
  const lastState = this.lastStates.pop();
  if (!lastState) return;

  this.nodes = lastState.nodes;
  this.edges = lastState.edges;
  this.logicalGraph = lastState.logicalGraph;
  this.dragEvent = null;
  this.temporaryCluster = null;
}

/**
 * Scales the graph and all stored states to the given width, height and nodeSize.
 */
export function scaleGraphRelative(
  this: PartialGraph,
  previousLayout: GraphDimensions,
  newLayout: GraphDimensions
) {
  scaleRelative(this.nodes, previousLayout, newLayout);
  this.lastStates.forEach((state) =>
    scaleRelative(state.nodes, previousLayout, newLayout)
  );
  this.nodeSize = newLayout.nodeSize;
}

/**
 * Returns a deep copy of the current nodes, edges and logical graph.
 */
export function copyState(this: PartialGraph): GraphState {
  const edges = this.edges.map((edge) => ({ ...edge }));
  const oldToNewNode = new Map<PartialClusterNode, PartialClusterNode>();

  const nodes = this.nodes.map((node) => {
    const newNode = structuredClone(node);
    oldToNewNode.set(node, newNode);
    return newNode;
  });

  edges.forEach((edge) => {
    const newSource = oldToNewNode.get(edge.source);
    const newTarget = oldToNewNode.get(edge.target);
    if (!newSource || !newTarget) {
      throw new Error(
        "There is an edge which connects nodes that are not in the node list"
      );
    }
    edge.source = newSource;
    edge.target = newTarget;
  });

  return {
    nodes,
    edges,
    logicalGraph: structuredClone(this.logicalGraph),
  };
}
