import GraphTest from "../../react_components/GraphTest";
import { Point } from "../../types/geometry";
import { moveCluster, moveNode } from "./GraphTest_helpers";


describe("GraphTest move to spots", () => {
  it("playground", () => {
    cy.viewport(1400, 950);
    cy.mount(<GraphTest />);

    const spots: Point[] = [
      { x: 100, y: 150 },
      { x: 550, y: 100 },
      { x: 1000, y: 150 },
      { x: 1000, y: 600 },
      { x: 550, y: 700 },
      { x: 100, y: 600 },
    ];

    moveNode(0, spots[1]);
    moveNode(1, spots[2]);
    moveNode(2, spots[3]);
    moveNode(3, spots[4]);
    moveNode(4, spots[5]);
    moveNode(5, spots[0]);

    const testIterations = 30;
    for (let i = 0; i < testIterations; i++) {
      const node = Math.floor(Math.random() * 5);
      const spot = Math.floor(Math.random() * 5);

      if (Math.random() < 0.75) {
        moveNode(node, spots[spot]);
      } else {
        moveCluster(node, spots[spot]);
      }
    }
  });
});
