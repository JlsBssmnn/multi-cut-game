import { useState } from "react";
import { Graph } from "../types/graph";
import GraphRenderer from "./GraphRenderer";
import fullyConnected from "../graphs/fullyConnected";

export interface Bar {
  width: number;
  color: string;
}

export default function GraphTest() {
  const [graph, setGraph] = useState<Graph>(fullyConnected(5));

  function addNew() {
    setGraph((graph) => fullyConnected(graph.nodes.length + 1));
  }

  return (
    <div>
      <button onClick={addNew}>Add new Element</button>
      <br />
      <div style={{ border: "solid 5px black", display: "inline-block" }}>
        <GraphRenderer width={800} height={600} nodeSize={50} graph={graph} />
      </div>
    </div>
  );
}
