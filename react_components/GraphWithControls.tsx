import { useState } from "react";
import { LogicalGraph } from "../types/graph";

// use no SSR for the graph renderer, because otherwise there is a
// problem, where the styles are different for the server and client
import dynamic from "next/dynamic";
import { graphTheme } from "../utils/constants";
const GameControls = dynamic(() => import("./GameControls"), {
  ssr: false,
});
const InteractiveGraph = dynamic(() => import("./InteractiveGraph"), {
  ssr: false,
});

export interface GraphWithControlsProps {
  graph: LogicalGraph;
}

export default function GraphWithControls(props: GraphWithControlsProps) {
  const [graph, setGraph] = useState<LogicalGraph>(props.graph);

  return (
    <div>
      <GameControls graph={graph} theme={graphTheme} />
      <div style={{ border: "solid 5px black", display: "inline-block" }}>
        <InteractiveGraph
          width={1100}
          height={800}
          margin={20}
          nodeSize={30}
          logicalGraph={graph}
          edgeThickness={6}
          graphTheme={graphTheme}
          emitGraphChange={setGraph}
        />
      </div>
    </div>
  );
}
