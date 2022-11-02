import { useEffect, useRef } from "react";
import { RenderForceGraph } from "../d3_components/FGExperimental";
import { miserables } from "../d3_components/miserables";

export default function d3forcegraph() {
  const div = useRef(null);

  useEffect(() => {
    if (div.current) {
      RenderForceGraph(div.current, miserables);
    }
  });

  return <div ref={div}></div>;
}
