import { useState } from "react";
import { LogicalGraph } from "../types/graph";
import fullyConnected from "../graphs/fullyConnected";

// use no SSR for the graph renderer, because otherwise there is a
// problem, where the styles are different for the server and client
import dynamic from "next/dynamic";
const GraphRenderer = dynamic(() => import("./InteractiveGraph"), {
  ssr: false,
});

export interface Bar {
  width: number;
  color: string;
}

export default function GraphTest() {
  const [graph, setGraph] = useState<LogicalGraph>(fullyConnected(6));

  function addNew() {
    setGraph((graph) => fullyConnected(graph.nodes.length + 1));
  }

  function removeNodeFromCluster(nodeID: string) {
    setGraph((graph) => {
      const newGraph = { ...graph };
      const maxGroup = Math.max(...graph.nodes.map((node) => node.group));
      const node = newGraph.nodes.find((node) => node.id == nodeID);

      if (node === undefined) return newGraph;
      node.group = maxGroup + 1;
      return newGraph;
    });
  }

  function moveNodeToCluster(nodeID: string, group: number) {
    setGraph((graph) => {
      const newGraph = { ...graph };
      const node = newGraph.nodes.find((node) => node.id == nodeID);

      if (node === undefined) return newGraph;
      node.group = group;
      return newGraph;
    });
  }

  function joinClusters(group1: number, group2: number) {
    if (group1 > group2) {
      [group1, group2] = [group2, group1];
    }
    setGraph((graph) => {
      const newGraph = {
        nodes: graph.nodes.map((node) => {
          if (node.group === group2) {
            return { ...node, group: group1 };
          } else {
            return { ...node };
          }
        }),
        edges: [...graph.edges],
      };

      return newGraph;
    });
  }

  return (
    <div>
      <button onClick={addNew}>Add new Element</button>
      <br />
      <div style={{ border: "solid 5px black", display: "inline-block" }}>
        <GraphRenderer
          width={1100}
          height={800}
          nodeSize={30}
          logicalGraph={graph}
          signalHandlers={{
            removeNodeFromCluster,
            moveNodeToCluster,
            joinClusters,
          }}
          edgeThickness={6}
        />
      </div>
    </div>
  );
}
