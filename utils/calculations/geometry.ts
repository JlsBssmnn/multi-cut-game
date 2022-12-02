import { Point } from "../../types/geometry";

/**
 * Returns the length from the coordinate-origin to the given point.
 */
export function vectorLength(point: Point): number {
  return Math.sqrt(point.x ** 2 + point.y ** 2);
}

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
  return clusterGraphSize(numOfElements, nodeSize) * (Math.sqrt(2) / 2 - 0.5);
}

/**
 * This function computes whether the given point is within the given square.
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

/**
 * This function computes whether the given point is within the given circle.
 * @param point The point that will be tested.
 * @param circleStart The upper left corner of the square that surrounds the circle.
 * @param diameter The diameter of the circle.
 */
export function pointInCircle(
  point: Point,
  circleStart: Point,
  diameter: number
): boolean {
  const radius = diameter / 2;
  const diff: Point = {
    x: circleStart.x + radius - point.x,
    y: circleStart.y + radius - point.y,
  };
  return vectorLength(diff) <= radius;
}

/**
 * This function computes whether the two given circles are intersecting
 * in at least one point. The start parameters are the upper left corner of
 * the squares that surround the circles, the diameter parameters are the
 * diameters of the circles.
 * @returns `true` if they intersect, `false` otherwise
 */
export function circlesIntersect(
  circle1Start: Point,
  circle2Start: Point,
  diameter1: number,
  diameter2: number
): boolean {
  const radius1 = diameter1 / 2;
  const radius2 = diameter2 / 2;

  const diff: Point = {
    x: circle1Start.x + radius1 - (circle2Start.x + radius2),
    y: circle1Start.y + radius1 - (circle2Start.y + radius2),
  };

  return vectorLength(diff) <= radius1 + radius2;
}
