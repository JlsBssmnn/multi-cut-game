import Control from "./Control";
import styles from "../../styles/LevelGenerator.module.scss";
import { Dispatch, SetStateAction } from "react";

interface RatioCostControlsProps {
  setNegativeCostFactor: Dispatch<SetStateAction<number>>;
}

export default function RatioCostControls({
  setNegativeCostFactor,
}: RatioCostControlsProps) {
  return (
    <div className={styles.controlContainer}>
      <Control
        name="Negative cost ratio"
        min={0}
        max={1}
        defaultValue={0.5}
        sliderStep={0.01}
        setter={setNegativeCostFactor}
      />
    </div>
  );
}
