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
import { getUserDevice } from "../../utils/cssUtils";
import { useWindowSize } from "../../utils/customHooks";

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
  const [width, height] = useWindowSize();

  const [dialog, setDialog] = useState<HTMLElement | null>(null);
  let dialogContentWidth = width;
  let dialogContentHeight = height;

  if (dialog) {
    const style = getComputedStyle(dialog);
    dialogContentWidth =
      dialog.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight);
    dialogContentHeight =
      dialog.clientHeight -
      parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom);
  }

  if (optimalMulticut == null) {
    return (
      <div className={styles.buttons}>
        <LoadingSpinner message="Computing optimal solution" />
      </div>
    );
  }

  const userDevice = getUserDevice(width, height);

  if (userDevice === "phone") {
    var showButtonText = "Best Solution";
    var nodeSize = 15;
  } else {
    var showButtonText = "Show optimal solution";
    var nodeSize = 30;
  }

  return (
    <div className={styles.buttons}>
      <Button
        variant="contained"
        onClick={() => setShowOptimalMulticut(true)}
        sx={{
          fontSize: "1.1rem",
        }}
      >
        {showButtonText}
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
        <DialogContent ref={(newRef) => setDialog(newRef as HTMLElement)}>
          <NonInteractiveGraph
            width={dialogContentWidth}
            height={dialogContentHeight}
            margin={5}
            nodeSize={nodeSize}
            logicalGraph={optimalMulticut}
            edgeThickness={6}
            graphTheme={theme}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
