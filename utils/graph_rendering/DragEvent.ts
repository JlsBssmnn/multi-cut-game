import { Point } from "../../types/geometry";
import { LogicalEdge } from "../../types/graph";

export default class DragEvent {
  /**
   * The id of the cluster that is dragged or the id of cluster that
   * contains the node that is dragged.
   */
  clusterNodeID: number;

  /**
   * The distance from the dragged node's origin to the pointer.
   */
  pointerOffset: Point;

  /**
   * The id of the node in the cluster that is dragged. If no
   * node in the cluster but just the cluster is dragged this
   * is undefined.
   */
  nodeID?: number;

  /**
   * The action that would be executed if the pointerOut event
   * would fire. This object also contains information that is
   * necessary to undo this action.
   */
  action: Reposition | MoveOut | MoveToCluster | JoinClusters = {
    name: "reposition",
  };

  constructor(clusterNodeID: number, pointerOffset: Point, nodeID?: number) {
    this.clusterNodeID = clusterNodeID;
    this.pointerOffset = pointerOffset;
    this.nodeID = nodeID;
  }
}

interface Reposition {
  name: "reposition";
}

interface MoveOut {
  name: "moveOut";
  originClusterID: number;
}

interface MoveToCluster {
  name: "moveToCluster";
  originClusterID: number;
  destinationClusterID: number;
}

interface JoinClusters {
  name: "joinClusters";
  removedEdges: LogicalEdge[];
  destinationClusterID: number;
}
