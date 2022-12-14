import {
  MulticutDecisions,
  Solution,
} from "../../utils/server_utils/findBestMulticut";
import styles from "../../styles/GameTools.module.scss";
import LoadingSpinner from "./LoadingSpinner";
import { Button } from "@mui/material";
import { LogicalGraph } from "../../types/graph";
import { getDecisionsFromGraph } from "../../utils/calculations/graphCalculations";
import { highlightedEdgeContext } from "../LevelFrame";
import { useContext } from "react";

export interface ShowHintProps {
  graph: LogicalGraph;
  optimalSolution: Solution | null;
}
export default function ShowHint({ graph, optimalSolution }: ShowHintProps) {
  const context = useContext(highlightedEdgeContext);
  const { setHighlightedEdge } = context!;

  if (optimalSolution == null) {
    return <LoadingSpinner message="Computing optimal solution" />;
  }

  const sendHint = () => {
    const decisions = getDecisionsFromGraph(graph);
    for (let edge of Object.keys(decisions)) {
      if (
        decisions[edge] !==
        optimalSolution.decisions[edge as keyof MulticutDecisions]
      ) {
        setHighlightedEdge(edge);
      }
    }
  };

  return (
    <Button
      className={styles.optimalCost}
      variant="contained"
      sx={{ fontSize: "1.1rem" }}
      onClick={sendHint}
    >
      Show Hint
    </Button>
  );
}
