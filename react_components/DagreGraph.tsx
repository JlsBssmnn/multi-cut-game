import styles from "../styles/Graph.module.scss";

/**
 * Deprecated: this uses dagre.js for laying out the graph. It expects a
 * dagre graph as input.
 */
export default function Graph({
  width,
  height,
  nodeSize,
  graph,
}: {
  width: number;
  height: number;
  nodeSize: number;
  graph: dagre.graphlib.Graph<{}>;
}) {
  const nodes = graph.nodes().map((id) => graph.node(id));

  const minWidth = Math.min(...nodes.map((node) => node.x));
  const minHeight = Math.min(...nodes.map((node) => node.y));
  const maxWidth = Math.max(...nodes.map((node) => node.x)) - minWidth;
  const maxHeight = Math.max(...nodes.map((node) => node.y)) - minHeight;

  nodes.forEach((node) => {
    node.x = (width - nodeSize) * ((node.x - minWidth) / maxWidth);
    node.y = (height - nodeSize) * ((node.y - minHeight) / maxHeight);
  });

  const edges = graph.edges().map((edge) => {
    const source = nodes[parseInt(edge.v)];
    const target = nodes[parseInt(edge.w)];
    const length = Math.sqrt(
      (source.x - target.x) ** 2 + (source.y - target.y) ** 2
    );
    var angle =
      Math.atan2(target.y - source.y, target.x - source.x) * (180 / Math.PI);

    return {
      left: source.x + nodeSize / 2,
      top: source.y + nodeSize / 2,
      width: length,
      transform: `rotate(${angle}deg)`,
    };
  });

  return (
    <div
      className={"noTouchAction"}
      style={{ width, height, position: "relative" }}
    >
      <div>
        {edges.map((edge, i) => (
          <div key={i} className={styles.edge} style={edge}></div>
        ))}
      </div>
      <div>
        {nodes.map((node, i) => (
          <div
            key={i}
            className={styles.node}
            style={{
              left: node.x,
              top: node.y,
              height: nodeSize,
              width: nodeSize,
              // backgroundColor: node.label == "Saul Williams" ? "red" : "black",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
