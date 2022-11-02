/**
 * Computes the diameter of a cluster node.
 * @param numOfElements The number of elements in that cluster
 * @param nodeSize The size of the nodes inside the cluster
 */
export function clusterDiameter(
  numOfElements: number,
  nodeSize: number
): number {
  const rectangleLen = numOfElements * nodeSize;
  return 2 * Math.sqrt(2 * (rectangleLen / 2) ** 2);
}

/**
 * Computes the distance from the origin of the cluster div
 * to the logical square that lies within that div.
 * @param numOfElements The number of elements in that cluster
 * @param nodeSize The size of the nodes inside the cluster
 */
export function clusterOffset(numOfElements: number, nodeSize: number): number {
  return numOfElements * nodeSize * (Math.sqrt(2) / 2 - 0.5);
}
