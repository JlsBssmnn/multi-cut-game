import { useState } from "react";
import { LogicalGraph } from "../types/graph";
import fullyConnected from "../graphs/fullyConnected";

// use no SSR for the graph renderer, because otherwise there is a
// problem, where the styles are different for the server and client
import dynamic from "next/dynamic";
import PartialGraphTheme from "../utils/graph_rendering/PartialGraphTheme";
const GameControls = dynamic(() => import("./GameControls"), {
  ssr: false,
});
const InteractiveGraph = dynamic(() => import("./InteractiveGraph"), {
  ssr: false,
});

export interface Bar {
  width: number;
  color: string;
}

export default function GraphWithControls() {
  const [graph, setGraph] = useState<LogicalGraph>(fullyConnected(7));

  const graphTheme = new PartialGraphTheme(
    [0, 0, 0],
    [224, 235, 245],
    [255, 255, 255],
    [0, 0, 0],
    0.5
  );

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
