import GeneratorControls from "./LevelGeneratorTools/GeneratorControls";
import styles from "../styles/LevelGenerator.module.scss";
import LevelPreviewFrame from "./LevelPreviewFrame";
import { useState } from "react";
import { LogicalGraph } from "../types/graph";
import { Layout } from "../utils/graph_layout/LayoutAlgorithms";
import { LayoutAlgorithms } from "../utils/graph_layout/LayoutAlgorithms";
import { Solution } from "../utils/server_utils/findBestMulticut";

export default function LevelGenerator() {
  const [graph, setGraph] = useState<LogicalGraph>({
    nodes: [],
    edges: [],
  });
  const [layout, setLayout] = useState<Layout>(LayoutAlgorithms.force);
  const [solution, setSolution] = useState<Solution | undefined>();

  return (
    <div className={styles.container}>
      <GeneratorControls
        {...{ graph, solution, setGraph, setSolution, setLayout }}
      />
      <LevelPreviewFrame
        graph={graph}
        setGraph={setGraph}
        layout={layout}
        solution={solution}
      />
    </div>
  );
}
