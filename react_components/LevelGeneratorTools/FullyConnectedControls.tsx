import Control from "./Control";
import styles from "../../styles/LevelGenerator.module.scss";
import { Dispatch, SetStateAction } from "react";

interface FullyConnectedControlsProps {
  setNodeCount: Dispatch<SetStateAction<number>>;
}

export default function FullyConnectedControls({
  setNodeCount,
}: FullyConnectedControlsProps) {
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
    </div>
  );
}
