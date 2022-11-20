import { LogicalGraph } from "../types/graph";
import findBestMulticut from "../utils/server_utils/findBestMulticut";

test("graph1", async () => {
  const edges = [
    { source: 0, target: 1, value: 5 },
    { source: 0, target: 2, value: -1 },
    { source: 1, target: 2, value: -2 },
  ];

  const solution = await findBestMulticut(edges);
  const dec = solution.decisions;
  expect(solution.cost).toBe(-3);
  expect(dec["0-1"]).toBe(0);
  expect(dec["0-2"]).toBe(1);
  expect(dec["1-2"]).toBe(1);
});

test("graph2", async () => {
  const edges = [
    { source: 0, target: 1, value: -10 },
    { source: 0, target: 3, value: 4 },
    { source: 1, target: 2, value: -5 },
    { source: 1, target: 4, value: 5 },
    { source: 2, target: 5, value: 13 },
    { source: 3, target: 4, value: 3 },
    { source: 4, target: 5, value: -7 },
  ];

  const solution = await findBestMulticut(edges);
  const dec = solution.decisions;
  expect(solution.cost).toBe(-19);
  expect(dec["0-1"]).toBe(1);
  expect(dec["0-3"]).toBe(0);
  expect(dec["1-2"]).toBe(1);
  expect(dec["1-4"]).toBe(0);
  expect(dec["2-5"]).toBe(0);
  expect(dec["3-4"]).toBe(1);
  expect(dec["4-5"]).toBe(1);
});

test("graph3", async () => {
  const edges = [
    { source: 0, target: 1, value: -1 },
    { source: 0, target: 4, value: -1 },
    { source: 0, target: 3, value: 1 },
    { source: 1, target: 2, value: 1 },
    { source: 3, target: 2, value: 1 },
    { source: 3, target: 4, value: 1 },
  ];

  const solution = await findBestMulticut(edges);
  expect(solution.cost).toBe(-1);
});

test("graph4", async () => {
  const edges = [
    { source: 0, target: 1, value: -6 },
    { source: 0, target: 2, value: 0 },
    { source: 0, target: 3, value: 7 },
    { source: 1, target: 2, value: 1 },
    { source: 1, target: 3, value: 4 },
    { source: 2, target: 3, value: 1 },
  ];

  const solution = await findBestMulticut(edges);
  const dec = solution.decisions;

  expect(solution.cost).toBe(-1);
  expect(dec["0-1"]).toBe(1);
  expect(dec["0-3"]).toBe(0);
  expect(dec["1-2"]).toBe(1);
  expect(dec["1-3"]).toBe(1);
  expect(dec["2-3"]).toBe(0);
});

test("graph5", async () => {
  const edges = [
    { source: 0, target: 1, value: 3 },
    { source: 0, target: 3, value: -2 },
    { source: 1, target: 2, value: -4 },
    { source: 1, target: 4, value: 3 },
    { source: 2, target: 5, value: 4 },
    { source: 3, target: 4, value: -5 },
    { source: 3, target: 6, value: 3 },
    { source: 4, target: 5, value: -4 },
    { source: 4, target: 7, value: 5 },
    { source: 5, target: 8, value: -4 },
    { source: 6, target: 7, value: 2 },
    { source: 7, target: 8, value: 0 },
  ];

  const solution = await findBestMulticut(edges);
  const dec = solution.decisions;

  expect(solution.cost).toBe(-17);
  expect(dec["0-1"]).toBe(0);
  expect(dec["0-3"]).toBe(1);
  expect(dec["1-2"]).toBe(1);
  expect(dec["1-4"]).toBe(0);
  expect(dec["2-5"]).toBe(0);
  expect(dec["3-4"]).toBe(1);
  expect(dec["3-6"]).toBe(0);
  expect(dec["4-5"]).toBe(1);
  expect(dec["4-7"]).toBe(0);
  expect(dec["5-8"]).toBe(1);
  expect(dec["6-7"]).toBe(1);
});
