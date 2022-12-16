import { Fab, Grow } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Dispatch,
  PointerEvent,
  SetStateAction,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import styles from "../styles/Graph.module.scss";
import { LogicalGraph } from "../types/graph";
import { GraphDimensions } from "../utils/graph_layout/scaleGraph";
import PartialGraph from "../utils/graph_rendering/PartialGraph/PartialGraph";
import PartialGraphTheme from "../utils/graph_rendering/PartialGraphTheme";
import GraphVisualization from "./GraphVisualization";
import { Point } from "../types/geometry";
import createPartialGraph from "../utils/graph_rendering/PartialGraph/createPartialGraph";
import { Layout } from "../utils/graph_layout/LayoutAlgorithms";
import { highlightedEdgeContext } from "./LevelFrame";
import { hintDuration } from "../utils/constants";

export interface InteractiveGraphProps {
  width: number;
  height: number;
  margin: number;
  nodeSize: number;
  logicalGraph: LogicalGraph;
  graphTheme: PartialGraphTheme;
  emitGraphChange: Dispatch<SetStateAction<LogicalGraph>>;
  layout: Layout;
}

type UpdateActions =
  | { type: "update" }
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
        newDimensions: GraphDimensions;
      };
    };

let partialGraph: PartialGraph | undefined;

let hintTimeout: NodeJS.Timeout;
let lastHint: string;

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
  graphTheme,
  emitGraphChange,
  layout,
}: InteractiveGraphProps) {
  useEffect(() => {
    partialGraph = createPartialGraph(
      logicalGraph,
      nodeSize,
      graphTheme,
      layout
    );
    layout.clusterLayout(partialGraph);
  }, []);

  const context = useContext(highlightedEdgeContext);
  let highlightedEdge;
  if (context && context.highlightedEdge !== "") {
    highlightedEdge = context.highlightedEdge;

    if (highlightedEdge !== lastHint) {
      clearTimeout(hintTimeout);
      hintTimeout = setTimeout(() => {
        context.setHighlightedEdge("");
        lastHint = "";
      }, hintDuration);
    }
    lastHint = highlightedEdge;
  }

  // This state is just used to trigger a rerender
  // @ts-ignore
  const [update, dispatch] = useReducer<typeof updateGraph>(updateGraph, false);

  function updateGraph(state: boolean, action: UpdateActions): boolean {
    if (!partialGraph) return state;
    switch (action.type) {
      case "nodeAt":
        partialGraph.nodeAt(action.payload.pointer);
        break;
      case "moveNode":
        partialGraph.moveNode(action.payload.pointer);
        break;
      case "sendAction":
        partialGraph.sendAction();
        break;
      case "undoAction":
        partialGraph.undoAction();
        break;
      case "scaleGraph": {
        const { width, height, margin } = action.payload;
        partialGraph.scaleWholeGraph(width, height, margin);
        break;
      }
      case "scaleGraphRelative": {
        const { newDimensions } = action.payload;
        partialGraph.scaleGraphRelative(newDimensions, margin);
        break;
      }
      case "update":
        break;
      default:
        return state;
    }
    return !state;
  }
  const graphScaled = useRef<boolean>(false);

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
    if (!graphScaled.current) {
      graphScaled.current = true;
      dispatch({
        type: "scaleGraph",
        payload: { width, height, nodeSize, margin },
      });
    } else {
      dispatch({
        type: "scaleGraphRelative",
        payload: {
          newDimensions,
        },
      });
    }
  }, [width, height, nodeSize]);

  if (!partialGraph || width <= 0 || height <= 0) return null;

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

  // for pointerUp and undoLastAction we must call the PartialGraph-method directly
  // because setting it in the reducer is asynchronous and thus the emitted logical
  // graph will not be the changed one
  function pointerUp() {
    partialGraph?.sendAction();
    dispatch({ type: "update" });
    emitGraphChange({ ...partialGraph!.logicalGraph });
  }

  function undoLastAction() {
    partialGraph?.undoAction();
    dispatch({ type: "update" });
    emitGraphChange({ ...partialGraph!.logicalGraph });
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
        graph={partialGraph}
        width={width}
        height={height}
        draggedClusterID={partialGraph.dragEvent?.clusterNode.id}
        highlightedEdge={highlightedEdge}
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
          <Fab
            onPointerDown={(e) => e.stopPropagation()}
            onClick={undoLastAction}
            color="primary"
          >
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
