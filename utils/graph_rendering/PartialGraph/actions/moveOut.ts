import { Point } from "../../../../types/geometry";
import { clusterDiameter, clusterOffset } from "../../../calculations/geometry";
import { ClusterDragEvent } from "../../DragEvent";
import PartialGraph from "../PartialGraph";

export function visualizeMoveOut(this: PartialGraph, pointerPosition: Point) {
  if (this.dragEvent == null || this.dragEvent instanceof ClusterDragEvent)
    return;

  const { nodeID } = this.dragEvent;

  this.removeNode(nodeID);
  const maxClusterID = Math.max(...this.nodes.map((node) => node.id));
  const offset = clusterOffset(1, this.nodeSize);

  // add the new cluster
  this.nodes.push({
    color: "white",
    id: maxClusterID + 1,
    size: clusterDiameter(1, this.nodeSize),
    x: pointerPosition.x,
    y: pointerPosition.y,
    borderColor: `rgba(0,0,0,${this.opacity})`,
    subgraph: {
      nodes: [
        {
          x: offset,
          y: offset,
          size: this.nodeSize,
          color: `rgba(0,0,0,${this.opacity})`,
          id: nodeID,
        },
      ],
      edges: [],
    },
  });

  // add the new edges
  const newEdges = this.computeClusterEdges(nodeID);
  Array.from(newEdges.entries()).forEach(([otherClusterID, value]) => {
    this.edges.push({
      source: maxClusterID + 1,
      target: otherClusterID,
      value: value,
      opacity: this.opacity,
    });
  });

  // update the drag event
  this.dragEvent.clusterNodeID = maxClusterID + 1;
  const relativePosition = this.dragEvent.relativeNodePosition;
  this.dragEvent.pointerOffset = {
    x: offset + relativePosition.x,
    y: offset + relativePosition.y,
  };
}
