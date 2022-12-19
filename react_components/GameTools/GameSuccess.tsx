import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Confetti from "react-confetti";
import styles from "../../styles/GameTools.module.scss";

export interface GameSuccessProps {
  shouldOpen: boolean;
  setDialogShown: Dispatch<SetStateAction<boolean>>;
}

export default function GameSuccess({
  shouldOpen,
  setDialogShown,
}: GameSuccessProps) {
  const [dialog, setDialog] = useState<HTMLDivElement | null>(null);

  return (
    <Dialog open={shouldOpen} maxWidth="lg">
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
