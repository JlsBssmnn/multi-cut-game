import styles from "../styles/Graph.module.scss";
import scaleGraph from "../utils/graph_layout/scaleGraph";
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
    layout.subgraphLayout
  );

  layout.clusterLayout(partialGraph);
  partialGraph.nodes.forEach((cluster) =>
    layout.subgraphLayout(partialGraph, cluster.subgraph)
  );

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
        draggedClusterID={partialGraph.dragEvent?.clusterNode.id}
      />
    </div>
  );
}
