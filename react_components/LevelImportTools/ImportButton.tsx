import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import InputIcon from "@mui/icons-material/Input";
import CloseIcon from "@mui/icons-material/Close";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Box } from "@mui/system";
import { Level } from "../../graphs/fixedLevels/levelTypes";
import { LayoutAlgorithms } from "../../utils/graph_layout/LayoutAlgorithms";
import {
  validateGraphAndLayout,
  validateSolution,
} from "../../graphs/levelVerification";

interface ImportButtonProps {
  setLevel: Dispatch<SetStateAction<Level | undefined>>;
}

export default function ImportButton({ setLevel }: ImportButtonProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);

  const [levelFile, setLevelFile] = useState<File>();
  const [solutionFile, setSolutionFile] = useState<File>();

  const levelUploadInput = useRef<HTMLInputElement>(null);
  const solutionUploadInput = useRef<HTMLInputElement>(null);

  function getResultAsString(result?: FileReader["result"]): string {
    if (!result || result instanceof ArrayBuffer) return "";

    return result;
  }

  function loadLevel() {
    if (!levelFile) return;
    const reader = new FileReader();
    reader.readAsText(levelFile);
    reader.onload = (e) => {
      const graphAndLayout = JSON.parse(getResultAsString(e.target?.result));
      const level = {
        graph: graphAndLayout.graph,
        solution: {
          cost: 1,
          decisions: {},
        },
        keyword: "",
        layout:
          LayoutAlgorithms[
            graphAndLayout.layout as keyof typeof LayoutAlgorithms
          ],
      };
      if (!validateGraphAndLayout(graphAndLayout)) {
        loadLevelError();
        return;
      } else if (!solutionFile) {
        loadLevelSuccess(level);
        return;
      }
      const reader2 = new FileReader();
      reader2.readAsText(solutionFile);
      reader2.onload = (e2) => {
        const solution = JSON.parse(getResultAsString(e2.target?.result));
        level.solution = solution;
        if (validateSolution(solution)) {
          loadLevelSuccess(level);
        } else {
          loadLevelError();
        }
      };
    };
  }

  function loadLevelError() {
    setSnackOpen(true);
  }

  function loadLevelSuccess(level: Level) {
    setLevel(level);
    setDialogOpen(false);
  }

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setDialogOpen(true)}
        style={{ position: "absolute", left: "5px", bottom: "5px" }}
      >
        <InputIcon />
      </Fab>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          Upload a level
          <IconButton onClick={() => setDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <input
            type="file"
            ref={levelUploadInput}
            style={{ display: "none" }}
            accept="application/json"
            onChange={() => setLevelFile(levelUploadInput.current?.files?.[0])}
          />
          <input
            type="file"
            ref={solutionUploadInput}
            style={{ display: "none" }}
            accept="application/json"
            onChange={() =>
              setSolutionFile(solutionUploadInput.current?.files?.[0])
            }
          />
          <Box
            display="grid"
            gap="10px"
            gridTemplateColumns="1fr 1fr"
            alignItems="center"
          >
            <Button
              variant="contained"
              onClick={() => levelUploadInput.current?.click()}
            >
              Import level
            </Button>
            <Typography
              variant="body1"
              sx={{ fontStyle: levelFile ? "normal" : "italic" }}
            >
              {levelFile ? levelFile.name : "no file selected"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => solutionUploadInput.current?.click()}
            >
              Import solution
            </Button>
            <Typography
              variant="body1"
              sx={{ fontStyle: solutionFile ? "normal" : "italic" }}
            >
              {solutionFile ? solutionFile.name : "no file selected"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button disabled={!levelFile} onClick={loadLevel}>
            Load Level
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Input files have a wrong format!
        </Alert>
      </Snackbar>
    </>
  );
}
