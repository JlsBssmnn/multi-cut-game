import Control from "./Control";
import styles from "../../styles/LevelGenerator.module.scss";
import { Dispatch, SetStateAction } from "react";

interface RandomControlsProps {
  setNodeCount: Dispatch<SetStateAction<number>>;
  setLinkProbability: Dispatch<SetStateAction<number>>;
}

export default function RandomControls({
  setNodeCount,
  setLinkProbability,
}: RandomControlsProps) {
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
        name="Link probability"
        min={0}
        max={1}
        defaultValue={0.5}
        sliderStep={0.01}
        setter={setLinkProbability}
      />
    </div>
  );
}
