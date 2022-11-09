import { useState } from "react";
import { LogicalGraph } from "../types/graph";
import fullyConnected from "../graphs/fullyConnected";

// use no SSR for the graph renderer, because otherwise there is a
// problem, where the styles are different for the server and client
import dynamic from "next/dynamic";
const InteractiveGraph = dynamic(() => import("./InteractiveGraph"), {
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

  return (
    <div>
      <button onClick={addNew}>Add new Element</button>
      <br />
      <div style={{ border: "solid 5px black", display: "inline-block" }}>
        <InteractiveGraph
          width={1100}
          height={800}
          nodeSize={30}
          logicalGraph={graph}
          edgeThickness={6}
          opacity={0.5}
          graphTheme={{
            clusterNodeColor: "rgb(224 235 245)",
            nodeColor: "black",
            tempClusterColor: "white",
          }}
          emitGraphChange={setGraph}
        />
      </div>
    </div>
  );
}
