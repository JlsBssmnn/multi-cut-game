import { useState } from "react";
import { Graph } from "../types/graph";
import fullyConnected from "../graphs/fullyConnected";
import randomGraph from "../graphs/random";
import gridGraph from "../graphs/grid";

// use no SSR for the graph renderer, because otherwise there is a
// problem, where the styles are different for the server and client
import dynamic from "next/dynamic";
const GraphRenderer = dynamic(() => import("./GraphRenderer"), {
  ssr: false,
});

export interface Bar {
  width: number;
  color: string;
}

export default function GraphTest() {
  const [graph, setGraph] = useState<Graph>(randomGraph(10, 0.3));

  function addNew() {
    setGraph((graph) => randomGraph(graph.nodes.length + 1));
  }

  return (
    <div>
      <button onClick={addNew}>Add new Element</button>
      <br />
      <div style={{ border: "solid 5px black", display: "inline-block" }}>
        <GraphRenderer width={1100} height={800} nodeSize={30} graph={graph} />
      </div>
    </div>
  );
}
