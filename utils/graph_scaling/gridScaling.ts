import { GeneralNode } from "../../types/graph";
import { gridLayoutSpacing } from "../constants";

/**
 * This function takes a set of node positions and scales them, s.t.
 * the distances between every pair of nodes is equal. It should only
 * be used for grid layouts.
 */
export function scaleGridLayout(
  nodes: GeneralNode[],
  width: number,
  height: number,
  margin: number = 0
): void {
  if (nodes.length === 0) return;
  const nodeSizes = new Set(nodes.map((node) => node.size));
  if (nodeSizes.size != 1)
    throw new Error("scaleGridLayout can only be called on a subgraph!");
  const nodeSize: number = nodeSizes.entries().next().value[0];

  const size = {
    x: width - margin * 2,
    y: height - margin * 2,
  };

  // find the minimum and maximum for the x and y coordinates among the nodes
  let minX: number, minY: number, maxX: number, maxY: number;
  (minX = minY = Infinity), (maxX = maxY = -Infinity);
  for (let node of nodes) {
    if (node.x < minX) minX = node.x;
    if (node.x > maxX) maxX = node.x;
    if (node.y < minY) minY = node.y;
    if (node.y > maxY) maxY = node.y;
  }
  const maxima = {
    x: maxX - minX,
    y: maxY - minY,
  };
  const minima = {
    x: minX,
    y: minY,
  };

  const edgeDistance = nodeSize * gridLayoutSpacing;

  let biggestStretch: ("x" | "y")[];
  if (maxima.x == maxima.y) {
    biggestStretch = ["x", "y"];
  } else if (maxima.x > maxima.y) {
    biggestStretch = ["x"];
  } else {
    biggestStretch = ["y"];
  }

  // scale the dimension that has the bigger stretch s.t. it completely fills
  // out the given width or height
  nodes.forEach((node) => {
    biggestStretch.forEach((coordinate) => {
      node[coordinate] =
        (size[coordinate] - node.size) *
          ((node[coordinate] - minima[coordinate]) / maxima[coordinate]) +
        margin;

      if (Number.isNaN(node[coordinate])) {
        node[coordinate] = size[coordinate] / 2 - node.size / 2 + margin;
      }
    });
  });

  let smallerStretch: "x" | "y" | null;
  if (biggestStretch.length === 2) smallerStretch = null;
  else if (biggestStretch[0] === "x") smallerStretch = "y";
  else smallerStretch = "x";

  // scale the smaller stretch s.t. it has the same node spacing as
  // the other dimension and s.t. it's centered
  if (smallerStretch && maxima[smallerStretch] !== 0) {
    const newMargin =
      (size[smallerStretch] -
        ((maxima[smallerStretch] + 1) * nodeSize +
          maxima[smallerStretch] * edgeDistance)) /
      2;
    nodes.forEach((node) => {
      if (!smallerStretch) return;
      node[smallerStretch] =
        (nodeSize + edgeDistance) *
          (node[smallerStretch] - minima[smallerStretch]) +
        margin +
        newMargin;
    });
  } else if (smallerStretch && maxima[smallerStretch] === 0) {
    const newMargin =
      (size[smallerStretch] -
        ((maxima[smallerStretch] + 1) * nodeSize +
          maxima[smallerStretch] * edgeDistance)) /
      2;
    nodes.forEach((node) => {
      if (!smallerStretch) return;
      node[smallerStretch] = margin + newMargin;
    });
  }
}
