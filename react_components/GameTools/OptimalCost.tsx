import { Button } from "@mui/material";
import styles from "../../styles/GameTools.module.scss";
import { useState } from "react";
import { Solution } from "../../utils/server_utils/findBestMulticut";
import LoadingSpinner from "./LoadingSpinner";
import { getUserDevice } from "../../utils/cssUtils";
import { useWindowSize } from "../../utils/customHooks";

export interface OptimalCostProps {
  optimalSolution: Solution | null;
}

export default function OptimalCost({ optimalSolution }: OptimalCostProps) {
  const [showOptimalCost, setShowOptimalCost] = useState<boolean>(false);

  const [width, height] = useWindowSize();
  const userDevice = getUserDevice(width, height);

  if (userDevice === "phone") {
    var showButtonText = "Best Cost";
  } else {
    var showButtonText = "Show optimal cost";
  }

  if (optimalSolution == null) {
    var element = <LoadingSpinner message="Computing optimal solution" />;
  } else {
    if (showOptimalCost) {
      var element = (
        <Button
          className={styles.optimalCost}
          variant="outlined"
          sx={{
            fontSize: "1.1rem",
          }}
          onClick={() => setShowOptimalCost(false)}
        >
          Optimal cost: {optimalSolution.cost}
        </Button>
      );
    } else {
      var element = (
        <Button
          className={styles.optimalCost}
          variant="contained"
          sx={{
            fontSize: "1.1rem",
          }}
          onClick={() => setShowOptimalCost(true)}
        >
          {showButtonText}
        </Button>
      );
    }
  }

  return element;
}
