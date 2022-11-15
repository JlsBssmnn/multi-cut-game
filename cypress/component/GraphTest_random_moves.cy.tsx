import GraphTest from "../../react_components/GraphTest";
import { dragFromTo, moveNode, moveNodeToNode, PointGenerator } from "./GraphTest_helpers";

const margin = 100;

describe("GraphTest move randomly", () => {
  it("playground", () => {
    const width = 1400, height = 950;
    cy.viewport(width, height);
    cy.mount(<GraphTest />);

    const gen = new PointGenerator(1100, 800, margin);

    const testIterations = 100;
    for (let i = 0; i < testIterations; i++) {
      const dest = gen.getPoint();

      if (Math.random() < 0.9) {
        if (Math.random() < 0.5) {
          const source = Math.floor(Math.random() * 6);
          const dest = Math.floor(Math.random() * 6);
          moveNodeToNode(source, dest);
        } else {
          const source = Math.floor(Math.random() * 6);
          moveNode(source, gen.getPoint());
        }
      } else {
        const source = gen.getPoint();
        dragFromTo(source, dest);
      }
    }
  });
});