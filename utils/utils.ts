/**
 * Copies the given object and set the prototye of the new
 * object to the same prototype of the given object. Thus
 * fields and methods are copied.
 */
export function copyObject<T extends Object>(object: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(object)), object);
}
