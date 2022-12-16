import { GeneralNode, PartialClusterNode } from "../../types/graph";

export interface GraphDimensions {
  width: number;
  height: number;
  nodeSize: number;
}

/**
 * This function takes a set of nodes (cluster nodes or normal nodes)
 * and scales them, s.t. the nodes completely fill out the dimensions
 * given by `width` and `height`.
 */
export function scaleLayout(
  nodes: GeneralNode[],
  width: number,
  height: number,
  margin: number = 0
): void {
  width -= margin * 2;
  height -= margin * 2;

  if (nodes.length === 1) {
    const node = nodes[0];
    node.x = width / 2 - node.size / 2 + margin;
    node.y = height / 2 - node.size / 2 + margin;
    return;
  }

  // find the minimum and maximum for the x and y coordinates among the nodes
  let minX: number, minY: number, maxX: number, maxY: number, minSize: number;
  (minX = minY = minSize = Infinity), (maxX = maxY = -Infinity);
  for (let node of nodes) {
    if (node.x < minX) minX = node.x;
    if (node.x > maxX) maxX = node.x;
    if (node.y < minY) minY = node.y;
    if (node.y > maxY) maxY = node.y;
    if (node.size < minSize) minSize = node.size;
  }
  maxX -= minX;
  maxY -= minY;

  // scale the nodes positions, s.t. they fill the given width and height
  nodes.forEach((node) => {
    node.x = (width - minSize) * ((node.x - minX) / maxX) + margin;
    node.y = (height - minSize) * ((node.y - minY) / maxY) + margin;

    if (Number.isNaN(node.x)) {
      node.x = margin;
    }
    if (Number.isNaN(node.y)) {
      node.y = margin;
    }
  });
}

/**
 * Scales the given nodes of a PartialGraph to the given dimensions relative
 * to the given `previousLayout`. Thus the relative positions of all nodes
 * within the previous layout will be preserved.
 * TODO: support a change in `nodeSize`
 */
export function scaleRelative(
  clusterNodes: PartialClusterNode[],
  previousDimensions: GraphDimensions,
  newDimensions: GraphDimensions
) {
  const xChange = newDimensions.width / previousDimensions.width;
  const yChange = newDimensions.height / previousDimensions.height;

  clusterNodes.forEach((clusterNode) => {
    const radius = clusterNode.size / 2;
    clusterNode.x = (clusterNode.x + radius) * xChange - radius;
    clusterNode.y = (clusterNode.y + radius) * yChange - radius;
  });
}
