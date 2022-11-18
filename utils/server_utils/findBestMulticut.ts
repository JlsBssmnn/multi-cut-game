import { LogicalEdge } from "../../types/graph";
import GLPK, { GLPK as GLPKType, LP } from "glpk.js";

export interface Solution {
  cost: number;
  decisions: {
    [key: string]: number;
  };
}

/**
 * This functions computes the best possible multicut for the
 * given edges.
 */
export default async function findBestMulticut(
  edges: LogicalEdge[]
): Promise<Solution> {
  // @ts-ignore
  const glpk: GLPKType = await GLPK();

  const nodeIDSet = new Set<number>();
  const edgeMap = new Map<string, number>();
  edges.forEach((edge) => {
    let { source, target, value } = edge;
    nodeIDSet.add(source);
    nodeIDSet.add(target);

    if (target < source) {
      [source, target] = [target, source];
    }
    edgeMap.set(`${source}-${target}`, value);
  });

  const nodeIDs = Array.from(nodeIDSet).sort((a, b) => a - b);
  const nodeCount = nodeIDs.length;
  const variables: LP["objective"]["vars"] = new Array(
    (nodeCount * (nodeCount - 1)) / 2
  );
  const constraints = new Array(
    (nodeCount * (nodeCount - 1) * (nodeCount - 2)) / 2
  );

  let varIndex = 0;
  let constraintIndex = 0;

  // create the variables and constraints for the IP:
  //   - each edge in the fully connected graph of the nodes is a variable
  //   - edges that don't exist in the actual graph have a coefficient of 0
  //   - for every triangle in the graph add the triangle constraint
  for (let i = 0; i < nodeIDs.length - 1; i++) {
    const nodeI = nodeIDs[i];
    for (let j = i + 1; j < nodeIDs.length; j++) {
      const nodeJ = nodeIDs[j];
      let mapKey = `${nodeI}-${nodeJ}`;
      let coefficient;
      if (edgeMap.has(mapKey)) {
        coefficient = edgeMap.get(mapKey)!;
      } else {
        coefficient = 0;
      }

      // create an edge that connects `nodeI` with `nodeJ`
      variables[varIndex] = {
        name: mapKey,
        coef: coefficient,
      };

      varIndex++;

      for (let k = j + 1; k < nodeIDs.length; k++) {
        // add the 3 triangle constraints for the nodes i, j and k
        const nodeK = nodeIDs[k];
        const var1 = `${nodeI}-${nodeJ}`,
          var2 = `${nodeI}-${nodeK}`,
          var3 = `${nodeJ}-${nodeK}`;

        for (let l = 0; l < 3; l++) {
          constraints[constraintIndex + l] = {
            name: "cons" + constraintIndex + l,
            vars: [
              { name: var1, coef: 1 - 2 * Number(l == 0) },
              { name: var2, coef: 1 - 2 * Number(l == 1) },
              { name: var3, coef: 1 - 2 * Number(l == 2) },
            ],
            bnds: { type: glpk.GLP_LO, ub: 3.0, lb: 0.0 },
          };
        }

        constraintIndex += 3;
      }
    }
  }

  // the linear program
  const lp = {
    name: "LP",
    objective: {
      direction: glpk.GLP_MIN,
      name: "obj",
      vars: variables,
    },
    subjectTo: constraints,
    binaries: variables.map((variable) => variable.name),
  };

  const result = glpk.solve(lp).result;
  const cost = result.z;
  const decisions: { [key: string]: number } = {};

  // only use the edges that were in the original graph
  Array.from(edgeMap.keys()).forEach((key) => {
    decisions[key] = result.vars[key];
  });

  return { cost, decisions };
}
