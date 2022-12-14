import { GeneralEdge, PartialSubgraph } from "../types/graph";
import PartialGraph from "../utils/graph_rendering/PartialGraph/PartialGraph";
import PartialGraphTheme from "../utils/graph_rendering/PartialGraphTheme";
import styles from "../styles/Graph.module.scss";

export interface GraphProps {
  graph: PartialGraph;
  width: number;
  height: number;
  draggedClusterID?: number;
  highlightedEdge?: string;
}

function getEdgeColor(edge: GeneralEdge, theme: PartialGraphTheme): string {
  if (edge.value === 0) {
    return theme.getColor("neutralEdgeColor");
  } else if (edge.value > 0) {
    return theme.getColor("positiveEdgeColor");
  } else {
    return theme.getColor("negativeEdgeColor");
  }
}

/**
 * This function computes the thickness of a rendered edge in pixels
 * depending on it's value by using the provided `edgeThickness` parameter.
 */
export function computeEdgeThickness(
  edgeThickness: number,
  value: number
): number {
  if (value === 0) {
    return Math.sqrt(edgeThickness);
  }
  return Math.sqrt(edgeThickness * Math.abs(value));
}

/**
 * This component displays a rendered graph.
 */
export default function GraphVisualization({
  graph,
  width,
  height,
  draggedClusterID,
  highlightedEdge,
}: GraphProps) {
  const { nodes, edges } = graph;
  const edgeThickness = graph.theme.edgeThickness;

  let hintEdge: GeneralEdge | null;
  if (highlightedEdge) {
    hintEdge = graph.getHintedEdge(highlightedEdge);
  }

  return (
    <svg width={width} height={height}>
      {edges.map((edge) => (
        <line
          key={`ce${edge.source.id}-${edge.target.id}`}
          x1={edge.source.x + edge.source.size / 2}
          y1={edge.source.y + edge.source.size / 2}
          x2={edge.target.x + edge.target.size / 2}
          y2={edge.target.y + edge.target.size / 2}
          stroke={getEdgeColor(edge, graph.theme)}
          strokeWidth={computeEdgeThickness(edgeThickness, edge.value)}
          opacity={edge.opacity}
          style={{ zIndex: 1 }}
          className={edge === hintEdge ? styles.blinkingEdge : ""}
        ></line>
      ))}
      {nodes.map((node) => (
        <g key={"n" + node.id} id={"clusterG" + node.id}>
          <circle
            id={"cluster" + node.id}
            cx={node.x + node.size / 2}
            cy={node.y + node.size / 2}
            r={node.size / 2}
            fill={node.color}
            stroke={node.borderColor}
            style={{
              zIndex: node.id === draggedClusterID ? 5 : undefined,
            }}
          />
          <g transform={`translate(${node.x},${node.y})`}>
            <SubgraphVisualization
              graph={node.subgraph}
              edgeThickness={edgeThickness}
              theme={graph.theme}
              hintEdge={hintEdge}
            />
          </g>
        </g>
      ))}
      {draggedClusterID !== undefined && (
        <use href={"#clusterG" + draggedClusterID} />
      )}
    </svg>
  );
}

interface SubgraphVisualizationProps {
  graph: PartialSubgraph;
  theme: PartialGraphTheme;
  edgeThickness: number;
  hintEdge: GeneralEdge | null;
}

function SubgraphVisualization({
  graph,
  theme,
  edgeThickness,
  hintEdge,
}: SubgraphVisualizationProps) {
  const { nodes, edges } = graph;

  return (
    <>
      {edges.map((edge) => (
        <line
          key={`ne${edge.source.id}-${edge.target.id}`}
          x1={edge.source.x + edge.source.size / 2}
          y1={edge.source.y + edge.source.size / 2}
          x2={edge.target.x + edge.target.size / 2}
          y2={edge.target.y + edge.target.size / 2}
          style={{ zIndex: 3 }}
          stroke={getEdgeColor(edge, theme)}
          strokeWidth={computeEdgeThickness(edgeThickness, edge.value)}
          opacity={edge.opacity}
          className={edge === hintEdge ? styles.blinkingEdge : ""}
        ></line>
      ))}
      {nodes.map((node) => (
        <circle
          key={"n" + node.id}
          id={"node" + node.id}
          cx={node.x + node.size / 2}
          cy={node.y + node.size / 2}
          r={node.size / 2}
          fill={node.color}
        ></circle>
      ))}
    </>
  );
}
