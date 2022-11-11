import styles from "../styles/Graph.module.scss";
import { ClusterNode, Graph, Subgraph } from "../types/graph";

export interface GraphProps {
  graph: Graph | Subgraph;
  draggedClusterID?: number;
}

/**
 * This component displays a rendered graph.
 */
export default function GraphVisualization({
  graph,
  draggedClusterID,
}: GraphProps) {
  const { nodes, edges } = graph;
  let isClusterGraph = false;
  if (nodes.length > 0) {
    isClusterGraph = "subgraph" in nodes[0];
  }

  return (
    <>
      {edges.map((edge, i) => (
        <div
          key={"e" + i}
          className={styles.edge}
          style={{ ...edge, zIndex: isClusterGraph ? 1 : 3 }}
        ></div>
      ))}
      {nodes.map((node, i) => (
        <div
          key={"n" + i}
          className={"subgraph" in node ? styles.clusterNode : styles.node}
          id={(isClusterGraph ? 'cluster' : 'node') + node.id}
          style={{
            left: node.x,
            top: node.y,
            height: node.size,
            width: node.size,
            backgroundColor: node.color,
            borderColor: isClusterGraph
              ? (node as ClusterNode).borderColor
              : undefined,
            zIndex:
              node.id === draggedClusterID && isClusterGraph ? 5 : undefined,
          }}
        >
          {isClusterGraph && (
            <GraphVisualization
              graph={(node as ClusterNode).subgraph}
              key={"g" + i}
            />
          )}
        </div>
      ))}
    </>
  );
}
