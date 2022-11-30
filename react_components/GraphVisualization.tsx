import {
  LogicalEdge,
  Node,
  PartialClusterNode,
  PartialSubgraph,
} from "../types/graph";
import PartialGraph from "../utils/graph_rendering/PartialGraph/PartialGraph";
import PartialGraphTheme from "../utils/graph_rendering/PartialGraphTheme";

export interface GraphProps {
  graph: PartialGraph;
  width: number;
  height: number;
  edgeThickness: number;
  draggedClusterID?: number;
}

function getEdgeColor(edge: LogicalEdge, theme: PartialGraphTheme): string {
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
  edgeThickness,
  draggedClusterID,
}: GraphProps) {
  const { nodes, edges } = graph;
  const nodeMap = new Map<number, PartialClusterNode>();
  nodes.forEach((node) => nodeMap.set(node.id, node));

  return (
    <svg width={width} height={height}>
      {edges.map((edge) => {
        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);
        if (!sourceNode || !targetNode) {
          throw new Error("There is an edge connecting nodes that don't exist");
        }
        return (
          <line
            key={`ce${edge.source}-${edge.target}`}
            x1={sourceNode.x + sourceNode.size / 2}
            y1={sourceNode.y + sourceNode.size / 2}
            x2={targetNode.x + targetNode.size / 2}
            y2={targetNode.y + targetNode.size / 2}
            stroke={getEdgeColor(edge, graph.theme)}
            strokeWidth={computeEdgeThickness(edgeThickness, edge.value)}
            opacity={edge.opacity}
            style={{ zIndex: 1 }}
          ></line>
        );
      })}
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
}

function SubgraphVisualization({
  graph,
  theme,
  edgeThickness,
}: SubgraphVisualizationProps) {
  const { nodes, edges } = graph;
  const nodeMap = new Map<number, Node>();
  nodes.forEach((node) => nodeMap.set(node.id, node));

  return (
    <>
      {edges.map((edge) => {
        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);
        if (!sourceNode || !targetNode) {
          throw new Error("There is an edge connecting nodes that don't exist");
        }
        return (
          <line
            key={`ne${edge.source}-${edge.target}`}
            x1={sourceNode.x + sourceNode.size / 2}
            y1={sourceNode.y + sourceNode.size / 2}
            x2={targetNode.x + targetNode.size / 2}
            y2={targetNode.y + targetNode.size / 2}
            style={{ zIndex: 3 }}
            stroke={getEdgeColor(edge, theme)}
            strokeWidth={computeEdgeThickness(edgeThickness, edge.value)}
            opacity={edge.opacity}
          ></line>
        );
      })}
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
