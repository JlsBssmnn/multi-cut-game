import { Point } from "../../types/geometry";

/**
 * Computes the length of the square inside the cluster node
 * which holds the subgraph of that cluster.
 */
export function clusterGraphSize(
  numOfElements: number,
  nodeSize: number
): number {
  return numOfElements * nodeSize;
}

/**
 * Computes the diameter of a cluster node.
 * @param numOfElements The number of elements in that cluster
 * @param nodeSize The size of the nodes inside the cluster
 */
export function clusterDiameter(
  numOfElements: number,
  nodeSize: number
): number {
  const rectangleLen = clusterGraphSize(numOfElements, nodeSize);
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

/**
 * This function computes wheter the given point is within the given square.
 * @param point The point that will be tested.
 * @param squareStart The upper left corner of the square.
 * @param squareSize The length of any of the sides of the square.
 */
export function pointInSquare(
  point: Point,
  squareStart: Point,
  squareSize: number
): boolean {
  return (
    squareStart.x <= point.x &&
    squareStart.y <= point.y &&
    point.x <= squareStart.x + squareSize &&
    point.y <= squareStart.y + squareSize
  );
}

/**
 * This function computes whether the two given squares are intersecting
 * in at least one point. The start parameters are the upper left corner of
 * the squares, the size parameters are the side lengths of the squares.
 * @returns `true` if they intersect, `false` otherwise
 */
export function squaresIntersect(
  square1Start: Point,
  square2Start: Point,
  size1: number,
  size2: number
): boolean {
  return (
    Math.max(square1Start.x, square2Start.x) <=
      Math.min(square1Start.x + size1, square2Start.x + size2) &&
    Math.max(square1Start.y, square2Start.y) <=
      Math.min(square1Start.y + size1, square2Start.y + size2)
  );
}
