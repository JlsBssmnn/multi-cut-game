import { LayoutAlgorithms } from "../../utils/graph_layout/LayoutAlgorithms";
import { Level } from "./levelTypes";

const keyword = "grid [small]";

const graph = {
  nodes: [
    { id: 0, group: 0 },
    { id: 1, group: 1 },
    { id: 2, group: 2 },
    { id: 3, group: 3 },
    { id: 4, group: 4 },
    { id: 5, group: 5 },
    { id: 6, group: 6 },
    { id: 7, group: 7 },
    { id: 8, group: 8 },
    { id: 9, group: 9 },
    { id: 10, group: 10 },
    { id: 11, group: 11 },
    { id: 12, group: 12 },
    { id: 13, group: 13 },
    { id: 14, group: 14 },
    { id: 15, group: 15 },
  ],
  edges: [
    { source: 0, target: 1, value: 1 },
    { source: 0, target: 4, value: -1 },
    { source: 1, target: 2, value: 1 },
    { source: 1, target: 5, value: -1 },
    { source: 2, target: 3, value: -1 },
    { source: 2, target: 6, value: 1 },
    { source: 3, target: 7, value: -1 },
    { source: 4, target: 5, value: -1 },
    { source: 4, target: 8, value: -1 },
    { source: 5, target: 6, value: 1 },
    { source: 5, target: 9, value: 1 },
    { source: 6, target: 7, value: -1 },
    { source: 6, target: 10, value: 1 },
    { source: 7, target: 11, value: 1 },
    { source: 8, target: 9, value: 1 },
    { source: 8, target: 12, value: -1 },
    { source: 9, target: 10, value: 1 },
    { source: 9, target: 13, value: 1 },
    { source: 10, target: 11, value: 1 },
    { source: 10, target: 14, value: 1 },
    { source: 11, target: 15, value: -1 },
    { source: 12, target: 13, value: 1 },
    { source: 13, target: 14, value: -1 },
    { source: 14, target: 15, value: 1 },
  ],
};

const solution = {
  cost: -7,
  decisions: {
    "0-1": 0,
    "0-4": 1,
    "1-2": 0,
    "1-5": 0,
    "2-3": 1,
    "2-6": 0,
    "3-7": 1,
    "4-5": 1,
    "4-8": 1,
    "5-6": 0,
    "5-9": 0,
    "6-7": 1,
    "6-10": 0,
    "7-11": 0,
    "8-9": 0,
    "8-12": 1,
    "9-10": 0,
    "9-13": 1,
    "10-11": 1,
    "10-14": 0,
    "11-15": 1,
    "12-13": 0,
    "13-14": 1,
    "14-15": 0,
  },
};

export default {
  graph,
  solution,
  keyword,
  layout: LayoutAlgorithms.grid,
} as Level;
