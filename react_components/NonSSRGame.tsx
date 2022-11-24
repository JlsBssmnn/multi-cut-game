import dynamic from "next/dynamic";
import { LogicalGraph } from "../types/graph";

// use no SSR for the graph renderer, because otherwise there is a
// problem, where the styles are different for the server and client
const GraphWithControls = dynamic(
  () => import("../react_components/GraphWithControls"),
  {
    ssr: false,
  }
);

export default function NonSSRGame({ graph }: { graph: LogicalGraph }) {
  return (
    <>
      <GraphWithControls graph={graph} />
    </>
  );
}
