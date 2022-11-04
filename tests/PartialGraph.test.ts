import { PartialClusterNode } from "../types/graph";
import PartialGraph from "../utils/graph_rendering/PartialGraph";

function createPartialGraph(
  ids: { id: number; nodeIDs: number[] }[]
): PartialGraph {
  const nodes: PartialClusterNode[] = ids.map((idStruct) => ({
    id: idStruct.id,
    x: 0,
    y: 0,
    color: "",
    size: 0,
    subgraph: {
      nodes: idStruct.nodeIDs.map((nodeID) => ({
        id: nodeID,
        x: 0,
        y: 0,
        color: "",
        size: 0,
      })),
      edges: [],
    },
  }));

  return new PartialGraph(nodes, [], {
    nodes: [],
    edges: [],
  });
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
  expect(graph1.getNode(1, 0)).toEqual(graph1.nodes[0].subgraph.nodes[1]);
  expect(graph1.getNode(2, 0)).toEqual(graph1.nodes[0].subgraph.nodes[2]);

  expect(() => graph1.getNode(4, 0)).toThrowError();
  expect(graph1.getNode(4)).toEqual(graph1.nodes[1].subgraph.nodes[0]);
  expect(() => graph1.getNode(11)).toThrowError();
});
