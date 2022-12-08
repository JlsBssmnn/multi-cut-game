import PartialGraphTheme from "./graph_rendering/PartialGraphTheme";

export const graphTheme = new PartialGraphTheme(
  [0, 0, 0], // nodeColor
  [224, 235, 245], // clusterNodeColor
  [255, 255, 255], // tempClusterColor
  [0, 0, 0], // clusterBorderColor
  [35, 195, 35], // positiveEdgeColor
  [255, 0, 0], // negativeEdgeColor
  [100, 100, 100], // neutralEdgeColor
  0.5, // opacity
  6 // edgeThickness
);

export const appBarHeight = 64;
export const nodeSize = 25;

// how much percent of the nodeSize is gonna be the distance between the nodes
export const gridLayoutSpacing = 1;
