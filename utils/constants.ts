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

export const levelCount = 8;

export const appBarHeight = 64;
export const nodeSize = 25;
export const graphMargin = 40;

// how much percent of the nodeSize is gonna be the distance between the nodes
export const gridLayoutSpacing = 1;

// How much percent of the nodeSize to use as space between cluster nodes when they
// overlap and are repositioned
export const clusterRepositioningSpacing = 1;

export const hintDuration = 3000;
