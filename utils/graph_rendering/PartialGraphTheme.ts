import { RGBColor } from "../../types/common";

// The keys of PartialGraphTheme that store a color
type Color =
  | "nodeColor"
  | "clusterNodeColor"
  | "tempClusterColor"
  | "clusterBorderColor";

export default class PartialGraphTheme {
  nodeColor: RGBColor;
  clusterNodeColor: RGBColor;
  tempClusterColor: RGBColor;
  clusterBorderColor: RGBColor;
  opacity: number;

  constructor(
    nodeColor: RGBColor,
    clusterNodeColor: RGBColor,
    tempClusterColor: RGBColor,
    clusterBorderColor: RGBColor,
    opacity: number
  ) {
    this.nodeColor = nodeColor;
    this.clusterNodeColor = clusterNodeColor;
    this.tempClusterColor = tempClusterColor;
    this.clusterBorderColor = clusterBorderColor;
    this.opacity = opacity;
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
