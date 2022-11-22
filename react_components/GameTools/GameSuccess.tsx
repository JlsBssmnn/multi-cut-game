import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useState } from "react";
import { Solution } from "../../utils/server_utils/findBestMulticut";
import Confetti from "react-confetti";
import styles from "../../styles/GameTools.module.scss";

export interface GameSuccessProps {
  currentCost: number;
  optimalSolution: Solution | null;
}

export default function GameSuccess({
  currentCost,
  optimalSolution,
}: GameSuccessProps) {
  const [dialogShown, setDialogShown] = useState<boolean>(false);
  const [dialog, setDialog] = useState<HTMLDivElement | null>(null);

  const open =
    !dialogShown &&
    optimalSolution != null &&
    currentCost === optimalSolution.cost;

  return (
    <Dialog open={open} maxWidth="lg">
      <div ref={(newRef) => setDialog(newRef)}>
        <DialogContent>
          <div className={styles.successMessage}>
            You found the optimal solution!
          </div>
          {dialog && (
            <Confetti
              width={dialog.getBoundingClientRect().width}
              height={dialog.getBoundingClientRect().height}
              numberOfPieces={100}
              wind={0.02}
              gravity={0.05}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={() => setDialogShown(true)}>
            Awesome!
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
