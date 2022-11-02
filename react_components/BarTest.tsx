import { PointerEvent, useEffect, useRef, useState } from "react";
import { interactive } from "../d3_components/bars";

export interface Bar {
  width: number;
  color: string;
}

export default function Test() {
  const [data, setData] = useState<Bar[]>([
    { width: 100, color: "green" },
    { width: 200, color: "green" },
    { width: 300, color: "green" },
    { width: 500, color: "green" },
    { width: 900, color: "green" },
    { width: 600, color: "green" },
    { width: 420, color: "green" },
  ]);
  const [selectedBar, setSelectedBar] = useState<Element | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (element.current) {
      interactive(element.current, data, setData);
    }
  }, [data]);

  useEffect(() => {
    if (selectedBar == null) return;
    const id = selectedBar.id;

    // setData((data) => data.filter((el) => String(el.width) !== id));
    setData((data) =>
      data.map((el) => {
        if (String(el.width) === id) {
          return { ...el, color: el.color === "red" ? "green" : "red" };
        } else {
          return el;
        }
      })
    );
  }, [selectedBar]);

  function addNew() {
    setData((data) => [
      ...data,
      { width: Math.round(Math.random() * 1000), color: "green" },
    ]);
  }

  function pointerMove(event: PointerEvent) {
    if (event.buttons === 1) {
      const element = document.elementFromPoint(event.clientX, event.clientY);
      if (!element || !element.id) return;

      setSelectedBar(element);
    }
  }

  function pointerDown(event: PointerEvent) {
    event.preventDefault();

    setRecording(true);
    const element = document.elementFromPoint(event.clientX, event.clientY);
    if (!element || !element.id) return;

    setSelectedBar(element);
  }

  function pointerUp() {
    setRecording(false);
  }

  return (
    <div>
      <h2 style={{ overflow: "scroll" }}>
        {data.length > 0 ? data.map((x) => x.width).toString() : "[]"}
      </h2>
      <button onClick={addNew}>Add new Element</button>
      <div
        className="noTouchAction"
        onPointerMove={pointerMove}
        onPointerDown={pointerDown}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        onPointerOut={() => console.log("pointer out")}
        ref={element}
      ></div>
    </div>
  );
}
