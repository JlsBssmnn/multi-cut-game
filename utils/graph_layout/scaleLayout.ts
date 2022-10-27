import { GraphRenderInfo } from "../../react_components/Graph";

/**
 * This function takes a set of node positions and scales them, s.t.
 * the nodes completely fill out the dimensions given by `width` and
 * `height`. The `nodeSize` is the size for one node of the graph.
 */
export default function scaleLayout(
  nodes: GraphRenderInfo["nodes"],
  width: number,
  height: number,
  nodeSize: number
): GraphRenderInfo["nodes"] {
  // find the minimum and maximum for the x and y coordinates among the nodes
  let minX: number, minY: number, maxX: number, maxY: number;
  (minX = minY = Infinity), (maxX = maxY = -Infinity);
  for (let node of nodes) {
    if (node.x < minX) minX = node.x;
    if (node.x > maxX) maxX = node.x;
    if (node.y < minY) minY = node.y;
    if (node.y > maxY) maxY = node.y;
  }
  maxX -= minX;
  maxY -= minY;

  // scale the nodes positions, s.t. they fill the given width and height
  nodes.forEach((node) => {
    node.x = (width - nodeSize) * ((node.x - minX) / maxX);
    node.y = (height - nodeSize) * ((node.y - minY) / maxY);
  });

  return nodes;
}
