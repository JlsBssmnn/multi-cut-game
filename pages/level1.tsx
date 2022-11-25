import NonSSRGame from "../react_components/NonSSRGame";

export default function Level1() {
  const graph = {
    nodes: [
      { id: 0, group: 0 },
      { id: 1, group: 1 },
      { id: 2, group: 2 },
      { id: 3, group: 3 },
      { id: 4, group: 4 },
      { id: 5, group: 5 },
      { id: 6, group: 6 },
    ],
    edges: [
      { source: 0, target: 1, value: 1 },
      { source: 0, target: 2, value: 1 },
      { source: 0, target: 3, value: 1 },
      { source: 0, target: 4, value: 1 },
      { source: 0, target: 5, value: -1 },
      { source: 0, target: 6, value: -1 },
      { source: 1, target: 2, value: -1 },
      { source: 1, target: 3, value: -1 },
      { source: 1, target: 4, value: 1 },
      { source: 1, target: 5, value: -1 },
      { source: 1, target: 6, value: 1 },
      { source: 2, target: 3, value: 1 },
      { source: 2, target: 4, value: 1 },
      { source: 2, target: 5, value: -1 },
      { source: 2, target: 6, value: -1 },
      { source: 3, target: 4, value: -1 },
      { source: 3, target: 5, value: -1 },
      { source: 3, target: 6, value: 1 },
      { source: 4, target: 5, value: -1 },
      { source: 4, target: 6, value: 1 },
      { source: 5, target: 6, value: -1 },
    ],
  };

  return (
    <>
      <NonSSRGame graph={graph} level={1} />
    </>
  );
}
