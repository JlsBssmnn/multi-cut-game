import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "../../styles/LevelGenerator.module.scss";
import FullyConnectedControls from "./FullyConnectedControls";
import GridControls from "./GridControls";
import RandomControls from "./RandomControls";
import RandomCostControls from "./RandomCostControls";
import RatioCostControls from "./RatioCostControls";
import TreeControls from "./TreeControls";
import DownloadIcon from "@mui/icons-material/Download";
import ComputerIcon from "@mui/icons-material/Computer";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Solution } from "../../utils/server_utils/findBestMulticut";
import { LogicalGraph } from "../../types/graph";
import {
  Layout,
  LayoutAlgorithms,
} from "../../utils/graph_layout/LayoutAlgorithms";
import gridGraph from "../../graphs/grid";
import randomGraph from "../../graphs/random";
import fullyConnected from "../../graphs/fullyConnected";
import tree from "../../graphs/tree";
import {
  randomCostGenerator,
  ratioCostGenerator,
} from "../../graphs/edgeCostGenerators";

interface GeneratorControlsProps {
  solution?: Solution;
  graph: LogicalGraph;
  setGraph: Dispatch<SetStateAction<LogicalGraph>>;
  setLayout: Dispatch<SetStateAction<Layout>>;
  setSolution: Dispatch<SetStateAction<Solution | undefined>>;
}

export default function GeneratorControls(props: GeneratorControlsProps) {
  const [computingSolution, setComputingSolution] = useState<boolean>(false);

  const [generatorAlgorithm, setGeneratorAlgorithm] = useState<string>("grid");
  const [costAlgorithm, setCostAlgorithm] = useState<string>("random");
  const [autoShow, setAutoShow] = useState<boolean>(false);

  const [nodeCount, setNodeCount] = useState<number>(0);
  const [linkProbability, setLinkProbability] = useState<number>(0);
  const [branchingFactor, setBranchingFactor] = useState<number>(0);
  const [negativeCostFactor, setNegativeCostFactor] = useState<number>(0);

  const downloadElement = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (autoShow) {
      generateGraph();
    }
  }, [
    generatorAlgorithm,
    costAlgorithm,
    autoShow,
    nodeCount,
    linkProbability,
    branchingFactor,
    negativeCostFactor,
  ]);

  function generateGraph() {
    props.setLayout(
      generatorAlgorithm === "grid"
        ? LayoutAlgorithms.grid
        : LayoutAlgorithms.force
    );

    switch (generatorAlgorithm) {
      case "grid":
        var graph = gridGraph(nodeCount);
        break;
      case "random":
        var graph = randomGraph(nodeCount, linkProbability);
        break;
      case "fully connected":
        var graph = fullyConnected(nodeCount);
        break;
      case "tree":
        var graph = tree(nodeCount, branchingFactor);
        break;
      default:
        throw new Error(`Invalid algorithm ${generatorAlgorithm}!`);
    }

    switch (costAlgorithm) {
      case "random":
        randomCostGenerator(graph, negativeCostFactor);
        break;
      case "ratio":
        ratioCostGenerator(graph, negativeCostFactor);
        break;
    }

    props.setGraph(graph);
    props.setSolution(undefined);
  }

  function downloadCurrentGraph() {
    if (!downloadElement.current) {
      return;
    }
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify({
          graph: props.graph,
          layout: generatorAlgorithm === "grid" ? "grid" : "force",
        })
      );
    downloadElement.current.setAttribute("href", dataStr);
    downloadElement.current.setAttribute("download", "level.json");
    downloadElement.current.click();
  }

  async function computeSolution() {
    setComputingSolution(true);
    const response = await fetch("/api/bestMulticut", {
      method: "POST",
      body: JSON.stringify(props.graph.edges),
    });
    const solution = await response.json();
    props.setSolution(solution);
    setComputingSolution(false);
  }

  function downloadSolution() {
    if (!downloadElement.current || !props.solution) {
      return;
    }
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(props.solution));
    downloadElement.current.setAttribute("href", dataStr);
    downloadElement.current.setAttribute("download", "solution.json");
    downloadElement.current.click();
  }

  function resetGraph() {
    props.setGraph((graph) => ({ ...graph }));
  }

  return (
    <Paper elevation={10} className={styles.generatorControls}>
      <a ref={downloadElement} style={{ display: "none" }} />
      <div className={styles.heading}>
        <h2>Generation Algorithm:</h2>
        <TextField
          select
          variant="standard"
          InputProps={{
            classes: {
              input: styles.largerFont,
            },
          }}
          value={generatorAlgorithm}
          onChange={(e) => setGeneratorAlgorithm(e.target.value)}
        >
          {["random", "grid", "fully connected", "tree"].map((alg) => (
            <MenuItem key={alg} value={alg}>
              {alg}
            </MenuItem>
          ))}
        </TextField>
      </div>
      {generatorAlgorithm === "grid" && <GridControls {...{ setNodeCount }} />}
      {generatorAlgorithm === "random" && (
        <RandomControls {...{ setNodeCount, setLinkProbability }} />
      )}
      {generatorAlgorithm === "fully connected" && (
        <FullyConnectedControls {...{ setNodeCount }} />
      )}
      {generatorAlgorithm === "tree" && (
        <TreeControls {...{ setNodeCount, setBranchingFactor }} />
      )}
      <div className={styles.heading}>
        <h2>Cost Algorithm:</h2>
        <TextField
          select
          variant="standard"
          InputProps={{
            classes: {
              input: styles.largerFont,
            },
          }}
          value={costAlgorithm}
          onChange={(e) => setCostAlgorithm(e.target.value)}
        >
          <MenuItem value={"random"}>random</MenuItem>
          <MenuItem value={"ratio"}>ratio</MenuItem>
        </TextField>
      </div>
      {costAlgorithm === "random" && (
        <RandomCostControls {...{ setNegativeCostFactor }} />
      )}
      {costAlgorithm === "ratio" && (
        <RatioCostControls {...{ setNegativeCostFactor }} />
      )}

      <Box
        display="flex"
        flex="row"
        alignItems="center"
        justifyContent="space-evenly"
        width="100%"
      >
        <Button
          variant="contained"
          startIcon={<VisibilityIcon />}
          color="success"
          onClick={generateGraph}
        >
          Show graph
        </Button>
        <FormControlLabel
          label="Auto show"
          control={
            <Checkbox
              checked={autoShow}
              onChange={(e) => setAutoShow(e.target.checked)}
            />
          }
          title="Automatically show level when settings change"
        />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        margin="auto"
        alignItems="center"
        justifyContent="center"
        gap="5px"
        padding="10px"
      >
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={downloadCurrentGraph}
        >
          Download Level
        </Button>
        <Button
          variant="contained"
          startIcon={
            computingSolution ? (
              <CircularProgress size="1.5rem" />
            ) : (
              <ComputerIcon />
            )
          }
          color="warning"
          onClick={computeSolution}
          disabled={computingSolution || props.solution !== undefined}
        >
          Compute Solution
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          disabled={!props.solution}
          onClick={downloadSolution}
        >
          Download Solution
        </Button>
      </Box>
      <Box margin="auto" gap="5px" padding="0 10px 10px 10px">
        <Button
          variant="contained"
          color="error"
          startIcon={<RestartAltIcon />}
          sx={{ width: "100%" }}
          style={{ width: "100%" }}
          onClick={resetGraph}
        >
          Reset graph
        </Button>
      </Box>
    </Paper>
  );
}
