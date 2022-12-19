import Ajv from "ajv";
import { LogicalGraph } from "../types/graph";
import { LayoutAlgorithmName } from "../utils/graph_layout/LayoutAlgorithms";
import { Solution } from "../utils/server_utils/findBestMulticut";

const ajv = new Ajv();

export interface LevelFile {
	graph: LogicalGraph;
	layout: LayoutAlgorithmName;
	solution?: Solution;
}

const levelSchema = {
  type: "object",
  properties: {
    graph: {
      type: "object",
      properties: {
        nodes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              group: { type: "number" },
            },
            required: ["id", "group"],
          },
        },
        edge: {
          type: "array",
          items: {
            type: "object",
            properties: {
              source: { type: "number" },
              target: { type: "number" },
              value: { type: "number" },
            },
            required: ["source", "target", "value"],
          },
        },
      },
      required: ["nodes", "edges"],
    },
    layout: { type: "string", enum: ["grid", "force"] },
    solution: {
      type: "object",
      properties: {
        cost: { type: "number" },
        decisions: {
          type: "object",
          patternProperties: {
            "^[0-9]+-[0-9]+$": { type: "integer" },
          },
          additionalProperties: false,
        },
      },
      required: ["cost", "decisions"],
    },
  },
  required: ["graph", "layout"],
};

export const validateLevel = ajv.compile(levelSchema);
