import Control from "./Control";
import styles from "../../styles/LevelGenerator.module.scss";
import { Dispatch, SetStateAction } from "react";

interface GridControlsProps {
  setNodeCount: Dispatch<SetStateAction<number>>;
}

export default function GridControls({ setNodeCount }: GridControlsProps) {
  return (
    <div className={styles.controlContainer}>
      <Control
        name="Width/Height"
        min={1}
        max={1000}
        sliderMax={20}
        defaultValue={5}
        setter={setNodeCount}
      />
    </div>
  );
}
