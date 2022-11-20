import { Node } from "../../types/graph";
import { clusterGraphSize, clusterOffset } from "../calculations/geometry";
import PartialGraph from "../graph_rendering/PartialGraph/PartialGraph";

/**
 * This function takes a partially rendered graph and scales all the cluster nodes to
 * fill the given width and height. Furthermore it'll scale the clusters and change their
 * offset, s.t. they are within their cluster nodes.
 */
export default function scaleGraph(
  graph: PartialGraph,
  width: number,
  height: number,
  nodeSize: number,
  margin: number = 0
) {
  scaleLayout(graph.nodes, width, height, margin);

  graph.nodes.forEach((cluster) => {
    const clusterNodes = cluster.subgraph.nodes;

    const clusterSize = clusterGraphSize(clusterNodes.length, nodeSize);
    scaleLayout(clusterNodes, clusterSize, clusterSize);

    const offset = clusterOffset(cluster.subgraph.nodes.length, nodeSize);

    clusterNodes.forEach((node) => {
      node.x += offset;
      node.y += offset;
    });
  });
}

/**
 * This function takes a set of node positions and scales them, s.t.
 * the nodes completely fill out the dimensions given by `width` and
 * `height`. The `nodeSize` is the size for one node of the graph.
 */
export function scaleLayout(
  nodes: Node[],
  width: number,
  height: number,
  margin: number = 0
): Node[] {
  width -= margin * 2;
  height -= margin * 2;

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
    node.x = (width - node.size) * ((node.x - minX) / maxX) + margin;
    node.y = (height - node.size) * ((node.y - minY) / maxY) + margin;

    if (Number.isNaN(node.x)) {
      node.x = margin;
    }
    if (Number.isNaN(node.y)) {
      node.y = margin;
    }
  });

  return nodes;
}
