import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../../styles/GameTools.module.scss";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import NonInteractiveGraph from "../NonInteractiveGraph";
import { LogicalGraph } from "../../types/graph";
import PartialGraphTheme from "../../utils/graph_rendering/PartialGraphTheme";

export interface OptimalMulticutProps {
  optimalMulticut: LogicalGraph | null;
  theme: PartialGraphTheme;
}

export default function OptimalMulticut({
  optimalMulticut,
  theme,
}: OptimalMulticutProps) {
  const [showOptimalMulticut, setShowOptimalMulticut] =
    useState<boolean>(false);

  if (optimalMulticut == null) {
    return (
      <div className={styles.buttons}>
        <LoadingSpinner message="Computing optimal solution" />
      </div>
    );
  }

  return (
    <div className={styles.buttons}>
      <Button variant="contained" onClick={() => setShowOptimalMulticut(true)}>
        Show optimal solution
      </Button>
      <Dialog
        onClose={() => setShowOptimalMulticut(false)}
        open={showOptimalMulticut}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          One optimal multicut
          <IconButton onClick={() => setShowOptimalMulticut(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <NonInteractiveGraph
            width={1100}
            height={800}
            margin={20}
            nodeSize={30}
            logicalGraph={optimalMulticut}
            edgeThickness={6}
            graphTheme={theme}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
