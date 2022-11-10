export type ClusterAction = Reposition | JoinClusters;
export type NodeAction = Reposition | MoveOut | MoveToCluster;

export type Action = Reposition | MoveOut | MoveToCluster | JoinClusters;

export interface Reposition {
  name: "reposition";
}

export interface MoveOut {
  name: "moveOut";
}

export interface MoveToCluster {
  name: "moveToCluster";
  destinationClusterID: number;
}

export interface JoinClusters {
  name: "joinClusters";
  destinationClusterID: number;
}

/**
 * Compares two actions and returns `true` if the actions are different.
 * If an action is different than the last action it requires changes in
 * the `PartialGraph`.
 */
export function differentActions(action1: Action, action2: Action): boolean {
  if (action1.name !== action2.name) return true;
  if ("destinationClusterID" in action1 && "destinationClusterID" in action2) {
    return action1.destinationClusterID !== action2.destinationClusterID;
  }
  return false;
}
