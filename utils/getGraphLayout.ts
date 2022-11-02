import dagre from "dagre";

export default function getGraphLayout(
  nodes: string[],
  edges: { source: string; target: string }[]
): dagre.graphlib.Graph<{}> {
  const graph = new dagre.graphlib.Graph();

  graph.setGraph({});

  // Default to assigning a new object as a label for each new edge.
  graph.setDefaultEdgeLabel(() => ({}));

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each of
  // our nodes.
  nodes.forEach((node) => {
    graph.setNode(node, {});
  });

  // Add edges to the graph.
  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  return graph;
}
