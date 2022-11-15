import { Point } from "../../../types/geometry";
import { Node, PartialClusterNode } from "../../../types/graph";
import { pointInSquare } from "../../calculations/geometry";
import { copyObject } from "../../utils";
import { ClusterDragEvent, NodeDragEvent } from "../DragEvent";
import PartialGraph from "./PartialGraph";

/**
 * Calculates which node is at the specified position as well as
 * the offset of the position to the node. The information is stored
 * as a `DragEvent`.
 */
export function nodeAt(this: PartialGraph, position: Point): PartialGraph {
  let clusterNode: PartialClusterNode | null = null;
  let node: Node | null = null;
  let clusterNodeID, nodeID;

  // check for collision with clusters
  for (let i = 0; i < this.nodes.length; i++) {
    clusterNode = this.nodes[i];

    if (pointInSquare(position, clusterNode, clusterNode.size)) {
      clusterNodeID = clusterNode.id;
      const subgraph = clusterNode.subgraph;

      if (subgraph.nodes.length < 2) {
        // if the cluster is a singleton, then select the entire cluster
        break;
      }

      // check for collision with nodes inside the cluster
      for (let j = 0; j < subgraph.nodes.length; j++) {
        node = subgraph.nodes[j];
        const nodePosition = {
          x: node.x + clusterNode.x,
          y: node.y + clusterNode.y,
        };

        if (pointInSquare(position, nodePosition, node.size)) {
          nodeID = node.id;
          break;
        }
      }
      break;
    }
  }

  if (clusterNodeID == null) {
    this.dragEvent = null;
    return copyObject(this);
  }

  const selectedNodeX = nodeID === undefined ? clusterNode!.x : node!.x;
  const selectedNodeY = nodeID === undefined ? clusterNode!.y : node!.y;

  const pointerOffset = {
    x: position.x - selectedNodeX,
    y: position.y - selectedNodeY,
  };

  if (nodeID === undefined) {
    this.dragEvent = new ClusterDragEvent(clusterNodeID, pointerOffset);
  } else {
    const relativePosition = {
      x: position.x - clusterNode!.x - node!.x,
      y: position.y - clusterNode!.y - node!.y,
    };
    this.dragEvent = new NodeDragEvent(
      clusterNodeID,
      pointerOffset,
      nodeID,
      relativePosition
    );
  }
  return copyObject(this);
}
