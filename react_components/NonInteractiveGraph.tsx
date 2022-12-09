import styles from "../styles/Graph.module.scss";
import createPartialGraph from "../utils/graph_rendering/PartialGraph/createPartialGraph";
import GraphVisualization from "./GraphVisualization";
import { InteractiveGraphProps } from "./InteractiveGraph";

export type NonInteractiveGraphProps = Omit<
  InteractiveGraphProps,
  "emitGraphChange"
>;

/**
 * This component displays the given graph but doesn't allow interaction.
 * This is the only difference between this component and the
 * `InteractiveGraph` component.
 */
export default function NonInteractiveGraph({
  width,
  height,
  margin,
  nodeSize,
  logicalGraph,
  graphTheme,
  layout,
}: NonInteractiveGraphProps) {
  const partialGraph = createPartialGraph(
    logicalGraph,
    nodeSize,
    graphTheme,
    layout
  );

  partialGraph.scaleWholeGraph(width, height, margin);

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
        draggedClusterID={partialGraph.dragEvent?.clusterNode.id}
      />
    </div>
  );
}
