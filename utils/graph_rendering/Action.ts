import { PartialClusterNode } from "../../types/graph";

export type ClusterAction = Reposition | JoinClusters;
export type NodeAction = Reposition | MoveOut | MoveToCluster;

export type Action = Reposition | MoveOut | MoveToCluster | JoinClusters;

export interface Reposition {
  name: "reposition";
}

export interface MoveOut {
  name: "moveOut";
  valid: boolean;
}

export interface MoveToCluster {
  name: "moveToCluster";
  destinationCluster: PartialClusterNode;
  valid: boolean;
}

export interface JoinClusters {
  name: "joinClusters";
  destinationCluster: PartialClusterNode;
  valid: boolean;
}

/**
 * Compares two actions and returns `true` if the actions are different.
 * If an action is different than the last action it requires changes in
 * the `PartialGraph`.
 */
export function differentActions(action1: Action, action2: Action): boolean {
  if (action1.name !== action2.name) return true;
  if ("destinationCluster" in action1 && "destinationCluster" in action2) {
    return action1.destinationCluster !== action2.destinationCluster;
  }
  return false;
}
