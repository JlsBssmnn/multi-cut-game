import fullyConnected from "../graphs/fullyConnected";
import { LogicalNode, LogicalEdge, LogicalGraph } from "../types/graph";
import {
  getClusterEdges,
  getClusters,
  layoutCluster,
} from "../utils/graph_layout/layoutGraph";
import PartialGraphTheme from "../utils/graph_rendering/PartialGraphTheme";

const nodes1: LogicalNode[] = [
  { id: 0, group: 0 },
  { id: 1, group: 0 },
  { id: 2, group: 0 },
  { id: 3, group: 0 },
  { id: 4, group: 0 },
];
const nodes2: LogicalNode[] = [
  { id: 0, group: 0 },
  { id: 1, group: 1 },
  { id: 2, group: 2 },
  { id: 3, group: 3 },
  { id: 4, group: 4 },
];
const nodes3: LogicalNode[] = [
  { id: 0, group: 0 },
  { id: 1, group: 0 },
  { id: 2, group: 1 },
  { id: 3, group: 0 },
  { id: 4, group: 1 },
];
const edges1: LogicalEdge[] = [
  { source: 0, target: 1, value: 1 },
  { source: 2, target: 3, value: 2 },
  { source: 3, target: 0, value: -5 },
];
const edges2: LogicalEdge[] = [
  { source: 0, target: 1, value: 1 },
  { source: 1, target: 2, value: -5 },
  { source: 2, target: 3, value: 1.3 },
  { source: 3, target: 4, value: 4 },
  { source: 4, target: 0, value: -1.9 },
];

test("getting the clusters", () => {
  expect(
    getClusters({
      nodes: nodes1,
      edges: [],
    })
  ).toEqual([{ id: 0, numOfElements: 5 }]);
  expect(
    getClusters({
      nodes: nodes2,
      edges: [],
    })
  ).toEqual([
    { id: 0, numOfElements: 1 },
    { id: 1, numOfElements: 1 },
    { id: 2, numOfElements: 1 },
    { id: 3, numOfElements: 1 },
    { id: 4, numOfElements: 1 },
  ]);
  expect(
    getClusters({
      nodes: nodes3,
      edges: [],
    })
  ).toEqual([
    { id: 0, numOfElements: 3 },
    { id: 1, numOfElements: 2 },
  ]);
});

test("getting the clusteredges", () => {
  // node set 1
  expect(
    getClusterEdges({
      nodes: nodes1,
      edges: edges2,
    })
  ).toEqual([]);

  // node set 2
  expect(
    getClusterEdges({
      nodes: nodes2,
      edges: edges1,
    })
  ).toEqual([
    { source: 0, target: 1, value: 1 },
    { source: 2, target: 3, value: 2 },
    { source: 0, target: 3, value: -5 },
  ]);

  expect(
    getClusterEdges({
      nodes: nodes2,
      edges: edges2,
    })
  ).toEqual([
    { source: 0, target: 1, value: 1 },
    { source: 1, target: 2, value: -5 },
    { source: 2, target: 3, value: 1.3 },
    { source: 3, target: 4, value: 4 },
    { source: 0, target: 4, value: -1.9 },
  ]);

  // node set 3
  expect(
    getClusterEdges({
      nodes: nodes3,
      edges: edges1,
    })
  ).toEqual([{ source: 0, target: 1, value: 2 }]);

  expect(
    getClusterEdges({
      nodes: nodes3,
      edges: edges2,
    })
  ).toEqual([{ source: 0, target: 1, value: -1.6 }]);
});

test("fully connected 6: cluster and edges", () => {
  const graph: LogicalGraph = fullyConnected(6);
  graph.nodes[0].group = 2;
  graph.nodes[1].group = 1;
  graph.nodes[2].group = 0;
  graph.nodes[3].group = 1;
  graph.nodes[4].group = 0;
  graph.nodes[5].group = 2;

  expect(getClusters(graph)).toEqual([
    { id: 2, numOfElements: 2 },
    { id: 1, numOfElements: 2 },
    { id: 0, numOfElements: 2 },
  ]);

  expect(getClusterEdges(graph)).toEqual([
    { source: 1, target: 2, value: 4 },
    { source: 0, target: 2, value: 4 },
    { source: 0, target: 1, value: 4 },
  ]);
});

test("layout cluster", () => {
  const graph1: LogicalGraph = {
    nodes: [
      { id: 0, group: 1 },
      { id: 3, group: 1 },
      { id: 5, group: 1 },
      { id: 6, group: 1 },
    ],
    edges: [
      { source: 0, target: 3, value: 1 },
      { source: 0, target: 6, value: 1 },
      { source: 3, target: 5, value: 1 },
    ],
  };
  const rendered1 = layoutCluster(
    graph1,
    10,
    new PartialGraphTheme(
      [0, 0, 255],
      [224, 235, 245],
      [255, 255, 255],
      [0, 0, 0],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      0.5
    ),
    1
  );

  expect(rendered1.nodes).toHaveLength(4);
  expect(rendered1.edges).toEqual([
    { source: 0, target: 3, value: 1 },
    { source: 0, target: 6, value: 1 },
    { source: 3, target: 5, value: 1 },
  ]);
});
