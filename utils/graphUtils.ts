export function assertEdgesExists<T>(...edges: (T | null | undefined)[]): T[] {
  if (edges.some((edge) => edge == null)) {
    throw new Error("There was an edge connecting non-existing nodes");
  }
  return edges as T[];
}
