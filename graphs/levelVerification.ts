import Ajv from "ajv";

const ajv = new Ajv();

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
