import * as d3 from "d3";
import { Dispatch, SetStateAction } from "react";
import { Bar } from "../react_components/Test";

function addBar(event: DragEvent, element) {
  data.push(Math.round(Math.random() * 1000));

  d3.select(element)
    .selectAll("div")
    .data(data, (data) => data)
    .enter()
    .append("div")
    .attr("id", (x) => x)
    .call(d3.drag().on("start", (el: DragEvent) => addBar(el, element)))
    .style("height", "100px")
    .style("width", (x) => `${x}px`)
    .style("background-color", "green");
}

function deleteBar(
  event: DragEvent,
  element,
  data: number[],
  setData: Dispatch<SetStateAction<number[]>>
) {
  const draggedElement: HTMLDivElement = event.sourceEvent.path[0];
  const id = parseInt(draggedElement.id);

  const newData = [...data];
  newData.splice(
    newData.findIndex((value) => value == id),
    1
  );
  setData(newData);

  // d3.select(element)
  //   .selectAll("div")
  //   .data(newData, (d) => d)
  //   .exit()
  //   .remove();
}

export function interactive(
  element: HTMLDivElement,
  data: Bar[],
  setData: Dispatch<SetStateAction<Bar[]>>
) {
  const height = 100;

  d3.select(element)
    .selectAll("div")
    .data(data, (d: Bar) => d.width)
    .join(
      (enter) => enter.append("div"),
      (update) => update,
      (exit) => exit.remove()
    )
    .transition()
    .delay(0)
    .duration(500)
    .ease(d3.easeLinear)
    .attr("id", (x) => x.width)
    // .call(
    //   d3
    //     .drag()
    //     .on("start", (el: DragEvent) => deleteBar(el, element, data, setData))
    // )
    .style("height", `${height}px`)
    .style("width", (x) => `${x.width}px`)
    .style("background-color", (x) => x.color);
}
