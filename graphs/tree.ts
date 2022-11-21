import { LogicalGraph } from "../types/graph";

export default function tree(
  numOfNodes: number,
  branchingFactor: number = 2
): LogicalGraph {
  const nodes = Array.from(Array(numOfNodes).keys()).map((i) => ({
    id: i,
    group: i,
  }));
  const edges = [];

  let iterNodeID = 1;
  const priorityList = [0];

  outerLoop: while (priorityList.length > 0) {
    let currentNodeID = priorityList.pop()!;
    for (let i = 0; i < branchingFactor; i++) {
      edges.push({ source: currentNodeID, target: iterNodeID, value: 0 });
      priorityList.unshift(iterNodeID);
      iterNodeID++;

      if (iterNodeID >= numOfNodes) {
        break outerLoop;
      }
    }
  }

  return { nodes, edges };
}
