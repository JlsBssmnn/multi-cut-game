import { PartialClusterNode } from "../types/graph";
import { graphTheme } from "../utils/constants";
import { LayoutAlgorithms } from "../utils/graph_layout/LayoutAlgorithms";
import PartialGraph from "../utils/graph_rendering/PartialGraph/PartialGraph";

function createPartialGraph(
  ids: { id: number; nodeIDs: number[] }[]
): PartialGraph {
  const nodes: PartialClusterNode[] = ids.map((idStruct) => ({
    id: idStruct.id,
    x: 0,
    y: 0,
    color: "",
    size: 0,
    borderColor: "black",
    subgraph: {
      nodes: idStruct.nodeIDs.map((nodeID) => ({
        id: nodeID,
        x: 0,
        y: 0,
        color: "",
        size: 0,
        group: idStruct.id,
      })),
      edges: [],
    },
  }));

  return new PartialGraph(
    nodes,
    [],
    {
      nodes: [],
      edges: [],
    },
    20,
    graphTheme,
		LayoutAlgorithms.force,
  );
}

// returns an array of nodeIDs for the given clusterNodeID for the graph
function getNodeIDs(graph: PartialGraph, clusterNodeID: number): number[] {
  return graph
    .getClusterNode(clusterNodeID)
    .subgraph.nodes.map((node) => node.id);
}

test("get nodes by id", () => {
  const graph1 = createPartialGraph([
    { id: 0, nodeIDs: [0, 1, 2, 3] },
    { id: 1, nodeIDs: [4, 5, 6, 7] },
    { id: 2, nodeIDs: [8, 9, 10] },
  ]);

  expect(graph1.getClusterNode(0)).toEqual(graph1.nodes[0]);
  expect(graph1.getClusterNode(1)).toEqual(graph1.nodes[1]);
  expect(graph1.getClusterNode(2)).toEqual(graph1.nodes[2]);
  expect(() => graph1.getClusterNode(3)).toThrowError();

  expect(graph1.getNode(0)).toEqual(graph1.nodes[0].subgraph.nodes[0]);
  expect(graph1.getNode(1)).toEqual(graph1.nodes[0].subgraph.nodes[1]);
  expect(graph1.getNode(1, graph1.getClusterNode(0))).toEqual(graph1.nodes[0].subgraph.nodes[1]);
  expect(graph1.getNode(2, graph1.getClusterNode(0))).toEqual(graph1.nodes[0].subgraph.nodes[2]);

  expect(() => graph1.getNode(4, graph1.getClusterNode(0))).toThrowError();
  expect(graph1.getNode(4)).toEqual(graph1.nodes[1].subgraph.nodes[0]);
  expect(() => graph1.getNode(11)).toThrowError();
});

test("remove node", () => {
  const graph1 = createPartialGraph([
    { id: 0, nodeIDs: [0, 1, 2, 3] },
    { id: 1, nodeIDs: [4, 5, 6, 7] },
    { id: 2, nodeIDs: [8, 9, 10] },
  ]);
  function getNode(id: number) {
    for (let cluster of graph1.nodes) {
      for (let node of cluster.subgraph.nodes) {
        if (node.id === id) return node;
      }
    }
    throw new Error(`Node ${id} not found`);
  }

  graph1.removeNode(getNode(0));

  expect(graph1.nodes.length).toBe(3);
  expect(getNodeIDs(graph1, 0)).toEqual([1, 2, 3]);

  graph1.removeNode(getNode(2));
  expect(getNodeIDs(graph1, 0)).toEqual([1, 3]);

  graph1.removeNode(getNode(3));
  expect(getNodeIDs(graph1, 0)).toEqual([1]);

  graph1.removeNode(getNode(1));
  expect(graph1.nodes.length).toBe(2);
  expect(() => graph1.getClusterNode(0)).toThrowError();
});
