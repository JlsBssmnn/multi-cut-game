import GraphTest from "../../react_components/GraphTest";
import { Point } from "../../types/geometry";

const nodeSize = 30;

// number of pixels to go into the cluster from it's origin
// to start a pointer event
const clusterMargin = 10;

function moveNode(nodeID: number, dest: Point) {
  cy.get("#node" + nodeID).then((n) => {
    let { left: x, top: y } = n.position();
    const { left: clusterNodeX, top: clusterNodeY } = n.parent().position();
    x += nodeSize / 2 + clusterNodeX;
    y += nodeSize / 2 + clusterNodeY;
    cy.get("#drag-area")
      .trigger("pointerdown", x, y, { buttons: 1, offsetX: x, offsetY: y })
      .trigger("pointermove", dest.x, dest.y, {
        buttons: 1,
        offsetX: dest.x,
        offsetY: dest.y,
      })
      .trigger("pointermove", dest.x, dest.y, {
        buttons: 1,
        offsetX: dest.x,
        offsetY: dest.y,
      })
      .trigger("pointerup");
  });
}

function moveCluster(nodeID: number, dest: Point) {
  cy.get("#node" + nodeID).parent().then((n) => {
      let { left: x, top: y } = n.position();
      x = Math.max(x, 0);
      y = Math.max(y, 0);
      x += clusterMargin;
      y += clusterMargin;

      const width = n.width(), height = n.height();
      if (width === undefined || height === undefined) {
        throw new Error("Tried to get size of cluster node, but got undefined");
      } else {
        dest.x -= width / 2;
        dest.y -= height / 2;
        dest.x = Math.max(dest.x, clusterMargin);
        dest.y = Math.max(dest.y, clusterMargin);
      }
      cy.get("#drag-area")
        .trigger("pointerdown", x, y, { buttons: 1, offsetX: x, offsetY: y })
        .trigger("pointermove", dest.x, dest.y, {
          buttons: 1,
          offsetX: dest.x,
          offsetY: dest.y,
        })
        .trigger("pointermove", dest.x, dest.y, {
          buttons: 1,
          offsetX: dest.x,
          offsetY: dest.y,
        })
        .trigger("pointerup");
  });
}

describe("GraphTest.cy.ts", () => {
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
