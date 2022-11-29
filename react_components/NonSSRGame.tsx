import dynamic from "next/dynamic";
import { LogicalGraph } from "../types/graph";
import { Solution } from "../utils/server_utils/findBestMulticut";

// use no SSR for the graph renderer, because otherwise there is a
// problem, where the styles are different for the server and client
const GraphWithControls = dynamic(
  () => import("../react_components/GraphWithControls"),
  {
    ssr: false,
  }
);

export interface NonSSRGameProps {
  graph: LogicalGraph;
  solution?: Solution;
}

export default function NonSSRGame({ graph, solution }: NonSSRGameProps) {
  return (
    <>
      <GraphWithControls graph={graph} solution={solution} />
    </>
  );
}
