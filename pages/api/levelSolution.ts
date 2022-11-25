import type { NextApiRequest, NextApiResponse } from "next";

const solutions = [
  {
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
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.method || req.method !== "GET") {
    res.status(405).json({
      status: 405,
      message: "Method not allowed",
    });
    return;
  }

  const levelString = req.query.level;

  if (!levelString || Array.isArray(levelString)) {
    res.status(400).json({
      status: 400,
      message: "One level must be provided as query parameter!",
    });
    return;
  }

  const level = parseInt(levelString);
  if (Number.isNaN(level) || level > solutions.length || level < 1) {
    res.status(400).json({
      status: 400,
      message: `There is no solution for level ${levelString}`,
    });
    return;
  }

  res.json(solutions[level - 1]);
}
