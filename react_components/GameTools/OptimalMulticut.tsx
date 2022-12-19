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
import { nodeSize } from "../../utils/constants";
import { Layout } from "../../utils/graph_layout/LayoutAlgorithms";
import { forceClusterLayout } from "../../utils/graph_layout/forceLayout";

export interface OptimalMulticutProps {
  optimalMulticut: LogicalGraph | null;
  theme: PartialGraphTheme;
  layout: Layout;
}

export default function OptimalMulticut({
  optimalMulticut,
  theme,
  layout,
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
    return <LoadingSpinner message="Computing optimal solution" />;
  }

  const userDevice = getUserDevice(width, height);

  if (userDevice === "phone") {
    var showButtonText = "Best Solution";
    var responsiveNodeSize = nodeSize - 5;
  } else {
    var showButtonText = "Show optimal solution";
    var responsiveNodeSize = nodeSize;
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setShowOptimalMulticut(true)}
        className={styles.gameToolButton}
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
            nodeSize={responsiveNodeSize}
            logicalGraph={optimalMulticut}
            graphTheme={theme}
            layout={{ ...layout, clusterLayout: forceClusterLayout }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
