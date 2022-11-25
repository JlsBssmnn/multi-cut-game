import { Fab, Grow } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Dispatch,
  PointerEvent,
  SetStateAction,
  useEffect,
  useReducer,
  useRef,
} from "react";
import styles from "../styles/Graph.module.scss";
import { LogicalGraph } from "../types/graph";
import layoutGraph from "../utils/graph_layout/layoutGraph";
import renderGraph from "../utils/graph_layout/renderEdges";
import scaleGraph, { GraphDimensions } from "../utils/graph_layout/scaleGraph";
import PartialGraph from "../utils/graph_rendering/PartialGraph/PartialGraph";
import PartialGraphTheme from "../utils/graph_rendering/PartialGraphTheme";
import GraphVisualization from "./GraphVisualization";
import { copyObject } from "../utils/utils";
import { Point } from "../types/geometry";

export interface InteractiveGraphProps {
  width: number;
  height: number;
  margin: number;
  nodeSize: number;
  logicalGraph: LogicalGraph;
  edgeThickness: number;
  graphTheme: PartialGraphTheme;
  emitGraphChange: Dispatch<SetStateAction<LogicalGraph>>;
}

type UpdateActions =
  | { type: "nodeAt"; payload: { pointer: Point } }
  | { type: "moveNode"; payload: { pointer: Point } }
  | { type: "sendAction" }
  | { type: "undoAction" }
  | {
      type: "scaleGraph";
      payload: {
        width: number;
        height: number;
        nodeSize: number;
        margin: number;
      };
    }
  | {
      type: "scaleGraphRelative";
      payload: {
        previousDimensions: GraphDimensions;
        newDimensions: GraphDimensions;
      };
    };

function updateGraph(graph: PartialGraph, action: UpdateActions): PartialGraph {
  switch (action.type) {
    case "nodeAt":
      return graph.nodeAt(action.payload.pointer);
    case "moveNode":
      return graph.moveNode(action.payload.pointer);
    case "sendAction":
      return graph.sendAction();
    case "undoAction":
      return graph.undoAction();
    case "scaleGraph":
      const { width, height, nodeSize, margin } = action.payload;
      scaleGraph(graph.nodes, width, height, nodeSize, margin);
      return copyObject(graph);
    case "scaleGraphRelative":
      const { previousDimensions, newDimensions } = action.payload;
      return graph.scaleGraphRelative(previousDimensions, newDimensions);
    default:
      return graph;
  }
}

/**
 * This component displays the given graph and enables interaction with it.
 * This mean that nodes can be dragged via the pointer and thus nodes can
 * be moved. If the move of a node denotes an action that changes the
 * clustering, this component will emit a signal to it's parent to inform
 * it of this change.
 */
export default function InteractiveGraph({
  width,
  height,
  margin,
  nodeSize,
  logicalGraph,
  edgeThickness,
  graphTheme,
  emitGraphChange,
}: InteractiveGraphProps) {
  const [partialGraph, dispatch] = useReducer<typeof updateGraph, undefined>(
    updateGraph,
    undefined,
    () => {
      const partialGraph = layoutGraph(logicalGraph, nodeSize, graphTheme);
      partialGraph.emitGraphChange = emitGraphChange;
      return partialGraph;
    }
  );
  const previousDimensions = useRef<GraphDimensions | null>(null);

  const renderedGraph = renderGraph(partialGraph, edgeThickness);

  useEffect(() => {
    emitGraphChange({ ...partialGraph.logicalGraph });
  }, [partialGraph.logicalGraph]);

  useEffect(() => {
    // as the page renders width and height will have weird
    // negative values we want to ignore
    if (width <= 0 || height <= 0) {
      return;
    }
    const newDimensions: GraphDimensions = {
      width,
      height,
      nodeSize,
    };
    if (previousDimensions.current == null) {
      previousDimensions.current = newDimensions;
      dispatch({
        type: "scaleGraph",
        payload: { width, height, nodeSize, margin },
      });
    } else {
      dispatch({
        type: "scaleGraphRelative",
        payload: {
          previousDimensions: previousDimensions.current,
          newDimensions,
        },
      });
      previousDimensions.current = newDimensions;
    }
  }, [width, height, nodeSize]);

  function pointerDown(event: PointerEvent) {
    event.preventDefault();
    const pointerPosition = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
    dispatch({ type: "nodeAt", payload: { pointer: pointerPosition } });
  }

  function pointerMove(event: PointerEvent) {
    if (
      event.buttons === 1 &&
      (event.target as HTMLElement).id === "drag-area"
    ) {
      const pointerPosition = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      dispatch({ type: "moveNode", payload: { pointer: pointerPosition } });
    }
  }

  function pointerUp() {
    dispatch({ type: "sendAction" });
  }

  function undoLastAction() {
    dispatch({ type: "undoAction" });
  }

  let validAction = true;
  const action = partialGraph.dragEvent?.action;
  if (action) {
    validAction = action.name === "reposition" || action.valid;
  }

  const undoPossible = partialGraph.lastStates.length > 0;

  return (
    <div
      className={`noTouchAction ${styles.graph}`}
      style={{
        width,
        height,
      }}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
    >
      <GraphVisualization
        graph={renderedGraph}
        draggedClusterID={partialGraph.dragEvent?.clusterNodeID}
      />
      {!validAction && (
        <div
          className={styles.invalidActionNotification}
          style={{ width, height }}
        >
          Invalid action
        </div>
      )}
      <Grow in={undoPossible}>
        <div className={styles.undoButton}>
          <Fab onClick={undoLastAction} color="primary">
            <UndoIcon />
          </Fab>
        </div>
      </Grow>
      <div
        id="drag-area"
        style={{ width, height }}
        className={styles.dragArea}
      ></div>
    </div>
  );
}
