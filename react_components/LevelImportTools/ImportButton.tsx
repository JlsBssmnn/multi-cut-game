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
import PublishIcon from "@mui/icons-material/Publish";
import { Dispatch, DragEvent, SetStateAction, useRef, useState } from "react";
import { Box } from "@mui/system";
import { Level } from "../../graphs/fixedLevels/levelTypes";
import { LayoutAlgorithms } from "../../utils/graph_layout/LayoutAlgorithms";
import { validateLevel } from "../../graphs/levelVerification";

interface ImportButtonProps {
  setLevel: Dispatch<SetStateAction<Level | undefined>>;
}

export default function ImportButton({ setLevel }: ImportButtonProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [snackText, setSnackText] = useState<string>("");
  const [snackOpen, setSnackOpen] = useState<boolean>(false);

  const [levelFile, setLevelFile] = useState<File>();

  const levelUploadInput = useRef<HTMLInputElement>(null);

  function dropFile(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!levelUploadInput.current || e.dataTransfer.files.length < 1) {
      return;
    } else if (e.dataTransfer.files[0].type !== "application/json") {
      setSnackText("You must upload a JSON file!");
      setSnackOpen(true);
      return;
    }
    levelUploadInput.current.files = e.dataTransfer.files;
    setLevelFile(e.dataTransfer.files[0]);
  }

  function getResultAsString(result?: FileReader["result"]): string {
    if (!result || result instanceof ArrayBuffer) return "";

    return result;
  }

  function loadLevel() {
    if (!levelFile) return;
    const reader = new FileReader();
    reader.readAsText(levelFile);
    reader.onload = (e) => {
      let importedLevel;
      try {
        importedLevel = JSON.parse(getResultAsString(e.target?.result));
      } catch {
        setSnackText("Provided file is not JSON!");
        setSnackOpen(true);
        return;
      }
      const level = {
        graph: importedLevel.graph,
        solution: importedLevel.solution ?? {
          cost: 1,
          decisions: {},
        },
        keyword: "",
        layout:
          LayoutAlgorithms[
            importedLevel.layout as keyof typeof LayoutAlgorithms
          ],
      };
      if (validateLevel(importedLevel)) {
        setLevel(level);
        setDialogOpen(false);
      } else {
        setSnackText("Input file has wrong format!");
        setSnackOpen(true);
      }
    };
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
          <Box
            display="grid"
            gap="10px"
            gridTemplateColumns="1fr 1fr"
            alignItems="center"
          >
            <Button
              variant="contained"
              startIcon={<PublishIcon />}
              onClick={() => levelUploadInput.current?.click()}
              onDrop={dropFile}
              onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              Import level
            </Button>
            <Typography
              variant="body1"
              sx={{ fontStyle: levelFile ? "normal" : "italic" }}
            >
              {levelFile ? levelFile.name : "no file selected"}
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
          {snackText}
        </Alert>
      </Snackbar>
    </>
  );
}
