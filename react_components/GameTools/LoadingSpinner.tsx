import { CircularProgress, Paper } from "@mui/material";
import styles from "../../styles/GameTools.module.scss";

export default function LoadingSpinner({ message }: { message: string }) {
  return (
    <Paper
      variant="outlined"
      className={styles.loadingSpinner}
      sx={{ height: "inherit" }}
    >
      <CircularProgress size="1.5rem" />
      <div>{message}</div>
    </Paper>
  );
}
