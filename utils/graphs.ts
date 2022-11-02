import dagre from "dagre";

export const graph = new dagre.graphlib.Graph();

graph.setGraph({});

// Default to assigning a new object as a label for each new edge.
graph.setDefaultEdgeLabel(() => ({}));

// Add nodes to the graph. The first argument is the node id. The second is
// metadata about the node. In this case we're going to add labels to each of
// our nodes.
graph.setNode("0", {});
graph.setNode("1", {});
graph.setNode("2", {});
graph.setNode("3", {});
graph.setNode("4", {});
graph.setNode("5", {});
graph.setNode("6", {});

// Add edges to the graph.
graph.setEdge("0", "1");
graph.setEdge("1", "5");
graph.setEdge("2", "5");
graph.setEdge("3", "4");
graph.setEdge("4", "5");
graph.setEdge("0", "6");

dagre.layout(graph);
