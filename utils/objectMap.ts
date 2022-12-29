export const objectMap = (obj: Object, fn: (..._: any) => any) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));
