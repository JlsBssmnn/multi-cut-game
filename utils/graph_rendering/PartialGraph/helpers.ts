import { Point } from "../../../types/geometry";
import {
  Edge,
  GeneralEdge,
  Node,
  PartialClusterNode,
  PartialSubgraph,
} from "../../../types/graph";
import {
  clusterDiameter,
  clusterOffset,
  vectorLength,
} from "../../calculations/geometry";
import { clusterRepositioningSpacing } from "../../constants";
import { GraphDimensions, scaleLayout } from "../../graph_layout/scaleGraph";
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
    throw new Error(
      `cluster node with id ${node.group} doesn't exist, but node with` +
        ` id ${node.id} belongs to it`
    );
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
 * @param clusterNode The clusterNode wich will be updated
 * @param sizeReference If provided the new size of the cluster node will
 * be determined depending on this subgraph
 */
export function changeClusterSize(
  this: PartialGraph,
  clusterNode: PartialClusterNode,
  sizeReference?: PartialSubgraph
) {
  const newSize = clusterDiameter(
    this.layout.computeSubgraphSize(this, sizeReference ?? clusterNode.subgraph)
  );
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
 * Recomputes the edges involving the given clusters and updates their value.
 * The edges with changed values (relative to before this call) are then added
 * either transparent (if the corresponding parameter is true) or opaque
 */
export function updateClusterEdges(
  this: PartialGraph,
  clusterNodes: PartialClusterNode[],
  transparent: boolean
) {
  function updateEdges(
    this: PartialGraph,
    clusterNode: PartialClusterNode,
    previousValues: Map<number, number>,
    transparent: boolean
  ) {
    this.edges = this.edges.filter(
      (edge) => edge.source !== clusterNode && edge.target !== clusterNode
    );
    const updatedEdges = this.computeClusterEdges(clusterNode.id);
    Array.from(updatedEdges.entries()).forEach(([otherCluster, value]) => {
      const t = transparent && value !== previousValues.get(otherCluster.id);
      this.edges.push({
        source: clusterNode,
        target: otherCluster,
        value: value,
        opacity: t ? this.theme.opacity : undefined,
      });
    });
  }
  const boundUpdateEdges = updateEdges.bind(this);
  const previousValues: Map<number, number>[] = new Array(clusterNodes.length);

  for (let i = 0; i < clusterNodes.length; i++) {
    previousValues[i] = new Map<number, number>();
    this.edges.forEach((edge) => {
      if (edge.source !== clusterNodes[i] && edge.target !== clusterNodes[i])
        return;

      const otherCluster =
        edge.source !== clusterNodes[i] ? edge.source : edge.target;
      previousValues[i].set(otherCluster.id, edge.value);
    });
  }

  for (let i = 0; i < clusterNodes.length; i++) {
    boundUpdateEdges(clusterNodes[i], previousValues[i], transparent);
  }
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
  clusterNode.subgraph = newSubgraph;

  // resize the cluster node
  this.changeClusterSize(clusterNode);

  // re-layout the subgraph
  this.layout.subgraphLayout(this, newSubgraph);

  const subgraphSize = this.layout.computeSubgraphSize(
    this,
    clusterNode.subgraph
  );
  const offset = clusterOffset(subgraphSize);

  this.layout.scaleSubgraph(newSubgraph.nodes, subgraphSize, subgraphSize, 0);
  newSubgraph.nodes.forEach((node) => {
    node.x += offset;
    node.y += offset;
  });
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
  this.temporarySplitClusters.splice(0);
}

/**
 * Scales the graph and all stored states to the given width, height and nodeSize.
 */
export function scaleGraphRelative(
  this: PartialGraph,
  newLayout: GraphDimensions,
  margin: number
) {
  this.width = newLayout.width;
  this.height = newLayout.height;

  scaleLayout(this.nodes, newLayout.width, newLayout.height, margin);
  this.lastStates.forEach((state) =>
    scaleLayout(state.nodes, newLayout.width, newLayout.height, margin)
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

/**
 * Lays out all the nodes (cluster nodes and nodes in the subgraph) and scales them
 * properly.
 */
export function scaleWholeGraph(
  this: PartialGraph,
  width: number,
  height: number,
  margin: number
): void {
  this.width = width;
  this.height = height;

  this.layout.clusterLayout(this);
  scaleLayout(this.nodes, width, height, margin);

  this.nodes.forEach((cluster) => {
    this.layout.subgraphLayout(this, cluster.subgraph);
    const size = this.layout.computeSubgraphSize(this, cluster.subgraph);
    const offset = clusterOffset(size);
    this.layout.scaleSubgraph(cluster.subgraph.nodes, size, size, 0);
    cluster.subgraph.nodes.forEach((node) => {
      node.x += offset;
      node.y += offset;
    });
  });
}

/**
 * Returns the edge that corresponds to the given hint (the edge which connctets
 * the 2 nodes in the string).
 */
export function getHintedEdge(
  this: PartialGraph,
  hint: string
): GeneralEdge | null {
  const source = this.getNode(parseInt(hint.substring(0, hint.indexOf("-"))));
  const target = this.getNode(parseInt(hint.substring(hint.indexOf("-") + 1)));

  if (source.group === target.group) {
    const cluster = this.getClusterNode(source.group);
    for (let edge of cluster.subgraph.edges) {
      if (
        (edge.source === source && edge.target === target) ||
        (edge.source === target && edge.target === source)
      ) {
        return edge;
      }
    }
  } else {
    const sourceCluster = this.getClusterNode(source.group);
    const targetCluster = this.getClusterNode(target.group);

    for (let edge of this.edges) {
      if (
        (edge.source === sourceCluster && edge.target === targetCluster) ||
        (edge.source === targetCluster && edge.target === sourceCluster)
      ) {
        return edge;
      }
    }
  }

  return null;
}

/**
 * Checks if the given cluster intersects with any other cluster in the `nodesToCheck` array.
 * If so, it tries to move the other cluster away s.t. they don't overlap anymore. If the
 * `nodesToCheck` array is not provided it defaults to all cluster nodes in the graph.
 */
export function fixClusterOverlap(
  this: PartialGraph,
  clusterNode: PartialClusterNode,
  nodesToCheck?: PartialClusterNode[]
): void {
  const radius = clusterNode.size / 2;
  const clusterNodePosition = {
    x: clusterNode.x + radius,
    y: clusterNode.y + radius,
  };
  const space = this.nodeSize * clusterRepositioningSpacing;

  (nodesToCheck ?? this.nodes).forEach((otherCluster) => {
    if (otherCluster === clusterNode) return;

    const otherRadius = otherCluster.size / 2;
    const diff = {
      x: otherCluster.x + otherRadius - clusterNodePosition.x,
      y: otherCluster.y + otherRadius - clusterNodePosition.y,
    };

    const diffLength = vectorLength(diff);
    const distanceToMove = radius + otherRadius + space - diffLength;

    if (distanceToMove <= 0) return;

    const scaleFactor = distanceToMove / diffLength;

    otherCluster.x = Math.min(
      Math.max(otherCluster.x + diff.x * scaleFactor, -otherRadius),
      this.width - otherRadius
    );
    otherCluster.y = Math.min(
      Math.max(otherCluster.y + diff.y * scaleFactor, -otherRadius),
      this.height - otherRadius
    );
  });
}
