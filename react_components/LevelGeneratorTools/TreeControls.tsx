import Control from "./Control";
import styles from "../../styles/LevelGenerator.module.scss";
import { Dispatch, SetStateAction } from "react";

interface TreeControlsProps {
  setNodeCount: Dispatch<SetStateAction<number>>;
  setBranchingFactor: Dispatch<SetStateAction<number>>;
}

export default function TreeControls({
  setNodeCount,
  setBranchingFactor,
}: TreeControlsProps) {
  return (
    <div className={styles.controlContainer}>
      <Control
        name="Number of nodes"
        min={1}
        max={1000}
        sliderMax={50}
        defaultValue={20}
        setter={setNodeCount}
      />
      <Control
        name="Branching factor"
        min={1}
        max={10}
        defaultValue={2}
        setter={setBranchingFactor}
      />
    </div>
  );
}
