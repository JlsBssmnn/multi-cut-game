import { Level } from "./levelTypes";

const keyword = "complete [large]";

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
    { source: 0, target: 2, value: 1 },
    { source: 0, target: 3, value: 1 },
    { source: 0, target: 4, value: -1 },
    { source: 0, target: 5, value: -1 },
    { source: 0, target: 6, value: 1 },
    { source: 0, target: 7, value: -1 },
    { source: 0, target: 8, value: 1 },
    { source: 0, target: 9, value: 1 },
    { source: 0, target: 10, value: 1 },
    { source: 0, target: 11, value: -1 },
    { source: 0, target: 12, value: 1 },
    { source: 0, target: 13, value: -1 },
    { source: 0, target: 14, value: 1 },
    { source: 0, target: 15, value: 1 },
    { source: 1, target: 2, value: 1 },
    { source: 1, target: 3, value: 1 },
    { source: 1, target: 4, value: 1 },
    { source: 1, target: 5, value: 1 },
    { source: 1, target: 6, value: -1 },
    { source: 1, target: 7, value: -1 },
    { source: 1, target: 8, value: -1 },
    { source: 1, target: 9, value: -1 },
    { source: 1, target: 10, value: -1 },
    { source: 1, target: 11, value: 1 },
    { source: 1, target: 12, value: -1 },
    { source: 1, target: 13, value: -1 },
    { source: 1, target: 14, value: 1 },
    { source: 1, target: 15, value: 1 },
    { source: 2, target: 3, value: 1 },
    { source: 2, target: 4, value: -1 },
    { source: 2, target: 5, value: -1 },
    { source: 2, target: 6, value: 1 },
    { source: 2, target: 7, value: -1 },
    { source: 2, target: 8, value: 1 },
    { source: 2, target: 9, value: 1 },
    { source: 2, target: 10, value: 1 },
    { source: 2, target: 11, value: 1 },
    { source: 2, target: 12, value: 1 },
    { source: 2, target: 13, value: -1 },
    { source: 2, target: 14, value: -1 },
    { source: 2, target: 15, value: 1 },
    { source: 3, target: 4, value: -1 },
    { source: 3, target: 5, value: 1 },
    { source: 3, target: 6, value: 1 },
    { source: 3, target: 7, value: -1 },
    { source: 3, target: 8, value: -1 },
    { source: 3, target: 9, value: -1 },
    { source: 3, target: 10, value: 1 },
    { source: 3, target: 11, value: -1 },
    { source: 3, target: 12, value: 1 },
    { source: 3, target: 13, value: -1 },
    { source: 3, target: 14, value: -1 },
    { source: 3, target: 15, value: -1 },
    { source: 4, target: 5, value: 1 },
    { source: 4, target: 6, value: 1 },
    { source: 4, target: 7, value: 1 },
    { source: 4, target: 8, value: -1 },
    { source: 4, target: 9, value: -1 },
    { source: 4, target: 10, value: 1 },
    { source: 4, target: 11, value: 1 },
    { source: 4, target: 12, value: -1 },
    { source: 4, target: 13, value: -1 },
    { source: 4, target: 14, value: -1 },
    { source: 4, target: 15, value: 1 },
    { source: 5, target: 6, value: 1 },
    { source: 5, target: 7, value: -1 },
    { source: 5, target: 8, value: -1 },
    { source: 5, target: 9, value: -1 },
    { source: 5, target: 10, value: 1 },
    { source: 5, target: 11, value: -1 },
    { source: 5, target: 12, value: -1 },
    { source: 5, target: 13, value: -1 },
    { source: 5, target: 14, value: -1 },
    { source: 5, target: 15, value: -1 },
    { source: 6, target: 7, value: 1 },
    { source: 6, target: 8, value: -1 },
    { source: 6, target: 9, value: 1 },
    { source: 6, target: 10, value: -1 },
    { source: 6, target: 11, value: 1 },
    { source: 6, target: 12, value: -1 },
    { source: 6, target: 13, value: 1 },
    { source: 6, target: 14, value: -1 },
    { source: 6, target: 15, value: -1 },
    { source: 7, target: 8, value: 1 },
    { source: 7, target: 9, value: -1 },
    { source: 7, target: 10, value: -1 },
    { source: 7, target: 11, value: 1 },
    { source: 7, target: 12, value: -1 },
    { source: 7, target: 13, value: 1 },
    { source: 7, target: 14, value: 1 },
    { source: 7, target: 15, value: -1 },
    { source: 8, target: 9, value: -1 },
    { source: 8, target: 10, value: 1 },
    { source: 8, target: 11, value: 1 },
    { source: 8, target: 12, value: 1 },
    { source: 8, target: 13, value: 1 },
    { source: 8, target: 14, value: -1 },
    { source: 8, target: 15, value: 1 },
    { source: 9, target: 10, value: 1 },
    { source: 9, target: 11, value: -1 },
    { source: 9, target: 12, value: 1 },
    { source: 9, target: 13, value: -1 },
    { source: 9, target: 14, value: 1 },
    { source: 9, target: 15, value: -1 },
    { source: 10, target: 11, value: -1 },
    { source: 10, target: 12, value: -1 },
    { source: 10, target: 13, value: 1 },
    { source: 10, target: 14, value: 1 },
    { source: 10, target: 15, value: 1 },
    { source: 11, target: 12, value: -1 },
    { source: 11, target: 13, value: -1 },
    { source: 11, target: 14, value: -1 },
    { source: 11, target: 15, value: -1 },
    { source: 12, target: 13, value: 1 },
    { source: 12, target: 14, value: 1 },
    { source: 12, target: 15, value: 1 },
    { source: 13, target: 14, value: -1 },
    { source: 13, target: 15, value: 1 },
    { source: 14, target: 15, value: -1 },
  ],
};

const solution = {
  cost: -25,
  decisions: {
    "0-1": 1,
    "0-2": 0,
    "0-3": 1,
    "0-4": 1,
    "0-5": 1,
    "0-6": 1,
    "0-7": 1,
    "0-8": 0,
    "0-9": 1,
    "0-10": 0,
    "0-11": 1,
    "0-12": 0,
    "0-13": 0,
    "0-14": 1,
    "0-15": 0,
    "1-2": 1,
    "1-3": 0,
    "1-4": 1,
    "1-5": 0,
    "1-6": 1,
    "1-7": 1,
    "1-8": 1,
    "1-9": 1,
    "1-10": 1,
    "1-11": 1,
    "1-12": 1,
    "1-13": 1,
    "1-14": 1,
    "1-15": 1,
    "2-3": 1,
    "2-4": 1,
    "2-5": 1,
    "2-6": 1,
    "2-7": 1,
    "2-8": 0,
    "2-9": 1,
    "2-10": 0,
    "2-11": 1,
    "2-12": 0,
    "2-13": 0,
    "2-14": 1,
    "2-15": 0,
    "3-4": 1,
    "3-5": 0,
    "3-6": 1,
    "3-7": 1,
    "3-8": 1,
    "3-9": 1,
    "3-10": 1,
    "3-11": 1,
    "3-12": 1,
    "3-13": 1,
    "3-14": 1,
    "3-15": 1,
    "4-5": 1,
    "4-6": 0,
    "4-7": 0,
    "4-8": 1,
    "4-9": 1,
    "4-10": 1,
    "4-11": 0,
    "4-12": 1,
    "4-13": 1,
    "4-14": 1,
    "4-15": 1,
    "5-6": 1,
    "5-7": 1,
    "5-8": 1,
    "5-9": 1,
    "5-10": 1,
    "5-11": 1,
    "5-12": 1,
    "5-13": 1,
    "5-14": 1,
    "5-15": 1,
    "6-7": 0,
    "6-8": 1,
    "6-9": 1,
    "6-10": 1,
    "6-11": 0,
    "6-12": 1,
    "6-13": 1,
    "6-14": 1,
    "6-15": 1,
    "7-8": 1,
    "7-9": 1,
    "7-10": 1,
    "7-11": 0,
    "7-12": 1,
    "7-13": 1,
    "7-14": 1,
    "7-15": 1,
    "8-9": 1,
    "8-10": 0,
    "8-11": 1,
    "8-12": 0,
    "8-13": 0,
    "8-14": 1,
    "8-15": 0,
    "9-10": 1,
    "9-11": 1,
    "9-12": 1,
    "9-13": 1,
    "9-14": 0,
    "9-15": 1,
    "10-11": 1,
    "10-12": 0,
    "10-13": 0,
    "10-14": 1,
    "10-15": 0,
    "11-12": 1,
    "11-13": 1,
    "11-14": 1,
    "11-15": 1,
    "12-13": 0,
    "12-14": 1,
    "12-15": 0,
    "13-14": 1,
    "13-15": 0,
    "14-15": 1,
  },
};

export default {
  graph,
  solution,
  keyword,
} as Level;