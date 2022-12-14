import { LayoutAlgorithms } from "../../utils/graph_layout/LayoutAlgorithms";
import { Level } from "./levelTypes";

const keyword = "grid [large]";

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
    { id: 16, group: 16 },
    { id: 17, group: 17 },
    { id: 18, group: 18 },
    { id: 19, group: 19 },
    { id: 20, group: 20 },
    { id: 21, group: 21 },
    { id: 22, group: 22 },
    { id: 23, group: 23 },
    { id: 24, group: 24 },
    { id: 25, group: 25 },
    { id: 26, group: 26 },
    { id: 27, group: 27 },
    { id: 28, group: 28 },
    { id: 29, group: 29 },
    { id: 30, group: 30 },
    { id: 31, group: 31 },
    { id: 32, group: 32 },
    { id: 33, group: 33 },
    { id: 34, group: 34 },
    { id: 35, group: 35 },
  ],
  edges: [
    { source: 0, target: 1, value: 1 },
    { source: 0, target: 6, value: -1 },
    { source: 1, target: 2, value: 1 },
    { source: 1, target: 7, value: -1 },
    { source: 2, target: 3, value: -1 },
    { source: 2, target: 8, value: -1 },
    { source: 3, target: 4, value: -1 },
    { source: 3, target: 9, value: 1 },
    { source: 4, target: 5, value: 1 },
    { source: 4, target: 10, value: 1 },
    { source: 5, target: 11, value: 1 },
    { source: 6, target: 7, value: 1 },
    { source: 6, target: 12, value: -1 },
    { source: 7, target: 8, value: 1 },
    { source: 7, target: 13, value: 1 },
    { source: 8, target: 9, value: -1 },
    { source: 8, target: 14, value: 1 },
    { source: 9, target: 10, value: -1 },
    { source: 9, target: 15, value: 1 },
    { source: 10, target: 11, value: 1 },
    { source: 10, target: 16, value: 1 },
    { source: 11, target: 17, value: -1 },
    { source: 12, target: 13, value: 1 },
    { source: 12, target: 18, value: -1 },
    { source: 13, target: 14, value: -1 },
    { source: 13, target: 19, value: -1 },
    { source: 14, target: 15, value: 1 },
    { source: 14, target: 20, value: 1 },
    { source: 15, target: 16, value: -1 },
    { source: 15, target: 21, value: -1 },
    { source: 16, target: 17, value: -1 },
    { source: 16, target: 22, value: 1 },
    { source: 17, target: 23, value: 1 },
    { source: 18, target: 19, value: -1 },
    { source: 18, target: 24, value: -1 },
    { source: 19, target: 20, value: -1 },
    { source: 19, target: 25, value: -1 },
    { source: 20, target: 21, value: 1 },
    { source: 20, target: 26, value: -1 },
    { source: 21, target: 22, value: -1 },
    { source: 21, target: 27, value: -1 },
    { source: 22, target: 23, value: 1 },
    { source: 22, target: 28, value: 1 },
    { source: 23, target: 29, value: 1 },
    { source: 24, target: 25, value: -1 },
    { source: 24, target: 30, value: 1 },
    { source: 25, target: 26, value: -1 },
    { source: 25, target: 31, value: 1 },
    { source: 26, target: 27, value: -1 },
    { source: 26, target: 32, value: -1 },
    { source: 27, target: 28, value: 1 },
    { source: 27, target: 33, value: 1 },
    { source: 28, target: 29, value: -1 },
    { source: 28, target: 34, value: 1 },
    { source: 29, target: 35, value: -1 },
    { source: 30, target: 31, value: 1 },
    { source: 31, target: 32, value: 1 },
    { source: 32, target: 33, value: 1 },
    { source: 33, target: 34, value: 1 },
    { source: 34, target: 35, value: -1 },
  ],
};

const solution = {
  cost: -25,
  decisions: {
    "0-1": 0,
    "0-6": 1,
    "1-2": 0,
    "1-7": 1,
    "2-3": 1,
    "2-8": 1,
    "3-4": 1,
    "3-9": 0,
    "4-5": 0,
    "4-10": 0,
    "5-11": 0,
    "6-7": 0,
    "6-12": 1,
    "7-8": 0,
    "7-13": 1,
    "8-9": 1,
    "8-14": 0,
    "9-10": 1,
    "9-15": 0,
    "10-11": 0,
    "10-16": 0,
    "11-17": 1,
    "12-13": 0,
    "12-18": 1,
    "13-14": 1,
    "13-19": 1,
    "14-15": 1,
    "14-20": 0,
    "15-16": 1,
    "15-21": 1,
    "16-17": 1,
    "16-22": 0,
    "17-23": 0,
    "18-19": 1,
    "18-24": 1,
    "19-20": 1,
    "19-25": 1,
    "20-21": 0,
    "20-26": 1,
    "21-22": 1,
    "21-27": 1,
    "22-23": 1,
    "22-28": 0,
    "23-29": 0,
    "24-25": 1,
    "24-30": 0,
    "25-26": 1,
    "25-31": 1,
    "26-27": 1,
    "26-32": 1,
    "27-28": 0,
    "27-33": 0,
    "28-29": 1,
    "28-34": 0,
    "29-35": 1,
    "30-31": 0,
    "31-32": 0,
    "32-33": 0,
    "33-34": 0,
    "34-35": 1,
  },
};

export default {
  graph,
  solution,
  keyword,
  layout: LayoutAlgorithms.grid,
} as Level;
