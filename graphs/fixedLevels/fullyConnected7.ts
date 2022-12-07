import { Level } from "./levelTypes";

const keyword = "complete [small]";

const graph = {
  nodes: [
    { id: 0, group: 0 },
    { id: 1, group: 1 },
    { id: 2, group: 2 },
    { id: 3, group: 3 },
    { id: 4, group: 4 },
    { id: 5, group: 5 },
    { id: 6, group: 6 },
  ],
  edges: [
    { source: 0, target: 1, value: 1 },
    { source: 0, target: 2, value: 1 },
    { source: 0, target: 3, value: 1 },
    { source: 0, target: 4, value: 1 },
    { source: 0, target: 5, value: -1 },
    { source: 0, target: 6, value: -1 },
    { source: 1, target: 2, value: -1 },
    { source: 1, target: 3, value: -1 },
    { source: 1, target: 4, value: 1 },
    { source: 1, target: 5, value: -1 },
    { source: 1, target: 6, value: 1 },
    { source: 2, target: 3, value: 1 },
    { source: 2, target: 4, value: 1 },
    { source: 2, target: 5, value: -1 },
    { source: 2, target: 6, value: -1 },
    { source: 3, target: 4, value: -1 },
    { source: 3, target: 5, value: -1 },
    { source: 3, target: 6, value: 1 },
    { source: 4, target: 5, value: -1 },
    { source: 4, target: 6, value: 1 },
    { source: 5, target: 6, value: -1 },
  ],
};

const solution = {
  cost: -7,
  decisions: {
    "0-1": 1,
    "0-2": 0,
    "0-3": 0,
    "0-4": 1,
    "0-5": 1,
    "0-6": 1,
    "1-2": 1,
    "1-3": 1,
    "1-4": 0,
    "1-5": 1,
    "1-6": 0,
    "2-3": 0,
    "2-4": 1,
    "2-5": 1,
    "2-6": 1,
    "3-4": 1,
    "3-5": 1,
    "3-6": 1,
    "4-5": 1,
    "4-6": 0,
    "5-6": 1,
  },
};

export default {
  graph,
  solution,
  keyword,
} as Level;
