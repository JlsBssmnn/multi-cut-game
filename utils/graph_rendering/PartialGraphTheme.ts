import { RGBColor } from "../../types/common";

// The keys of PartialGraphTheme that store a color
type Color =
  | "nodeColor"
  | "clusterNodeColor"
  | "tempClusterColor"
  | "clusterBorderColor"
  | "positiveEdgeColor"
  | "negativeEdgeColor"
  | "neutralEdgeColor";

export default class PartialGraphTheme {
  nodeColor: RGBColor;
  clusterNodeColor: RGBColor;
  tempClusterColor: RGBColor;
  clusterBorderColor: RGBColor;

  positiveEdgeColor: RGBColor;
  negativeEdgeColor: RGBColor;
  neutralEdgeColor: RGBColor;

  opacity: number;
  edgeThickness: number;

  constructor(
    nodeColor: RGBColor,
    clusterNodeColor: RGBColor,
    tempClusterColor: RGBColor,
    clusterBorderColor: RGBColor,
    positiveEdgeColor: RGBColor,
    negativeEdgeColor: RGBColor,
    neutralEdgeColor: RGBColor,
    opacity: number,
    edgeThickness: number
  ) {
    this.nodeColor = nodeColor;
    this.clusterNodeColor = clusterNodeColor;
    this.tempClusterColor = tempClusterColor;
    this.clusterBorderColor = clusterBorderColor;

    this.positiveEdgeColor = positiveEdgeColor;
    this.negativeEdgeColor = negativeEdgeColor;
    this.neutralEdgeColor = neutralEdgeColor;

    this.opacity = opacity;
    this.edgeThickness = edgeThickness;
  }

  getTransparentColor(color: Color): string {
    const [r, g, b] = this[color];
    return `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
  }

  getColor(color: Color): string {
    const [r, g, b] = this[color];
    return `rgb(${r}, ${g}, ${b})`;
  }
}
