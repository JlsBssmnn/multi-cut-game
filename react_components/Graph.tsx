import { RenderedGraph } from "./InteractiveGraph";
import styles from "../styles/Graph.module.scss";

export interface GraphProps {
  graph: RenderedGraph;
}

/**
 * This component displays a rendered graph.
 */
export default function Graph({ graph }: GraphProps) {
  const { nodes, edges } = graph;

  return (
    <>
      {edges.map((edge, i) => (
        <div key={"e" + i} className={styles.edge} style={edge}></div>
      ))}
      {nodes.map((node, i) => (
        <div
          key={"n" + i}
          className={styles.node}
          style={{
            left: node.x,
            top: node.y,
            height: node.size,
            width: node.size,
            backgroundColor: node.color,
          }}
        >
          {node.subgraph && <Graph graph={node.subgraph} key={"g" + i} />}
        </div>
      ))}
    </>
  );
}
