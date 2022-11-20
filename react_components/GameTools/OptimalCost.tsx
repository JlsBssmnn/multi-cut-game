import { Button } from "@mui/material";
import styles from "../../styles/GameTools.module.scss";
import { useState } from "react";
import { Solution } from "../../utils/server_utils/findBestMulticut";
import LoadingSpinner from "./LoadingSpinner";

export interface OptimalCostProps {
  optimalSolution: Solution | null;
}

export default function OptimalCost({ optimalSolution }: OptimalCostProps) {
  const [showOptimalCost, setShowOptimalCost] = useState<boolean>(false);

  if (optimalSolution == null) {
    var element = <LoadingSpinner message="Computing optimal solution" />;
  } else {
    if (showOptimalCost) {
      var element = (
        <Button
          variant="outlined"
          sx={{
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
          onClick={() => setShowOptimalCost(false)}
        >
          Optimal cost: {optimalSolution.cost}
        </Button>
      );
    } else {
      var element = (
        <Button
          variant="contained"
          sx={{
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
          onClick={() => setShowOptimalCost(true)}
        >
          Show optimal cost
        </Button>
      );
    }
  }

  return <div className={styles.optimalCost}>{element}</div>;
}
