import { Point } from "../../types/geometry";

const nodeSize = 30;

// number of pixels to go into the cluster from it's origin
// to start a pointer event
const clusterMargin = 10;

export function moveNode(nodeID: number, dest: Point) {
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

export function moveCluster(nodeID: number, dest: Point) {
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

export function moveNodeToNode(node1ID: number, node2ID: number) {
  cy.get("#node" + node1ID).then((n) => {
    let { left: sourceX, top: sourceY } = n.position();
    const { left: clusterNodeX, top: clusterNodeY } = n.parent().position();
    sourceX += nodeSize / 2 + clusterNodeX;
    sourceY += nodeSize / 2 + clusterNodeY;

    cy.get("#node" + node2ID).then((n) => {
      let { left: destX, top: destY } = n.position();
      const { left: clusterNodeX, top: clusterNodeY } = n.parent().position();
      destX += nodeSize / 2 + clusterNodeX;
      destY += nodeSize / 2 + clusterNodeY;

      cy.get("#drag-area")
        .trigger("pointerdown", sourceX, sourceY, { buttons: 1, offsetX: sourceX, offsetY: sourceY })
        .trigger("pointermove", destX, destY, {
          buttons: 1,
          offsetX: destX,
          offsetY: destY,
        })
        .trigger("pointermove", destX, destY, {
          buttons: 1,
          offsetX: destX,
          offsetY: destY,
        })
        .trigger("pointerup");
      });
  });
}

export function dragFromTo(source: Point, destination: Point) {
  cy.get("#drag-area")
    .trigger("pointerdown", source.x, source.y, { buttons: 1, offsetX: source.x, offsetY: source.y })
    .trigger("pointermove", destination.x, destination.y, {
      buttons: 1,
      offsetX: destination.x,
      offsetY: destination.y,
    })
    .trigger("pointermove", destination.x, destination.y, {
      buttons: 1,
      offsetX: destination.x,
      offsetY: destination.y,
    })
    .trigger("pointerup");
}

export class PointGenerator {
  width: number;
  height: number;
  margin: number;

  constructor(width: number, height: number, margin: number) {
    this.width = width;
    this.height = height;
    this.margin = margin;
  }

  getPoint() {
    const x = Math.random() * this.width - this.margin;
    const y = Math.random() * this.height - this.margin;

    return {
      x: Math.max(x, this.margin),
      y: Math.max(y, this.margin),
    }
  }
}