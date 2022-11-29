import styles from "../styles/Graph.module.scss";
import layoutGraph from "../utils/graph_layout/layoutGraph";
import scaleGraph from "../utils/graph_layout/scaleGraph";
import GraphVisualization from "./GraphVisualization";
import { InteractiveGraphProps } from "./InteractiveGraph";

export type NonInteractiveGraphProps = Omit<
  InteractiveGraphProps,
  "emitGraphChange"
>;

/**
 * This component displays the given graph but doen't allow interaction.
 * This is the only difference between this component and the
 * `InteractiveGraph` component.
 */
export default function NonInteractiveGraph({
  width,
  height,
  margin,
  nodeSize,
  logicalGraph,
  edgeThickness,
  graphTheme,
}: NonInteractiveGraphProps) {
  const partialGraph = layoutGraph(logicalGraph, nodeSize, graphTheme);
  scaleGraph(partialGraph.nodes, width, height, nodeSize, margin);

  return (
    <div
      className={styles.graph}
      style={{
        width,
        height,
      }}
    >
      <GraphVisualization
        graph={partialGraph}
        width={width}
        height={height}
        edgeThickness={edgeThickness}
        draggedClusterID={partialGraph.dragEvent?.clusterNode.id}
      />
    </div>
  );
}
