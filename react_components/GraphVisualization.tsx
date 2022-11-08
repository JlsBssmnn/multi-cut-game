import styles from "../styles/Graph.module.scss";
import { Graph, Subgraph } from "../types/graph";

export interface GraphProps {
  graph: Graph | Subgraph;
}

/**
 * This component displays a rendered graph.
 */
export default function GraphVisualization({ graph }: GraphProps) {
  const { nodes, edges } = graph;

  return (
    <>
      {edges.map((edge, i) => (
        <div key={"e" + i} className={styles.edge} style={edge}></div>
      ))}
      {nodes.map((node, i) => (
        <div
          key={"n" + i}
          className={"subgraph" in node ? styles.clusterNode : styles.node}
          style={{
            left: node.x,
            top: node.y,
            height: node.size,
            width: node.size,
            backgroundColor: node.color,
            borderColor:
              "subgraph" in node ? node.borderColor ?? "black" : undefined,
          }}
        >
          {"subgraph" in node && (
            <GraphVisualization graph={node.subgraph} key={"g" + i} />
          )}
        </div>
      ))}
    </>
  );
}
