import type { NextApiRequest, NextApiResponse } from "next";
import { LogicalEdge } from "../../types/graph";
import findBestMulticut from "../../utils/server_utils/findBestMulticut";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.method || req.method !== "POST") {
    res.status(405).json({
      status: 405,
      message: "Method not allowed",
    });
    return;
  }

  let edges: LogicalEdge[] | string = req.body;

  if (typeof edges === "string") {
    edges = JSON.parse(edges);
  }

  if (!Array.isArray(edges)) {
    res.status(400).json({
      status: 400,
      message: "Body has wrong format",
    });
    return;
  }

  res.json(await findBestMulticut(edges));
}
