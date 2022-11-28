/**
 * Copies the given object and set the prototype of the new
 * object to the same prototype of the given object. Thus
 * fields and methods are copied.
 */
export function copyObject<T extends Object>(object: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(object)), object);
}

/**
 * Shuffles the given array.
 */
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/**
 * Creates a random integer x, s.t. low <= x < hight
 */
export function randomInt(low: number, high: number): number {
  if (high <= low) throw new Error("Invalid arguments for randomInt()");
  return Math.floor(Math.random() * (high - low)) + low;
}

/**
 * Checks for deep equality of two objects.
 */
export function deepEqual(x: any, y: any): boolean {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y;
}
