export function arraysOfObjectsAreEqual(
  a: { [key: string]: any }[],
  b: { [key: string]: any }[]
): boolean {
  if (a.length !== b.length) return false;
  const sortedA = a.sort(objectSorter);
  const sortedB = b.sort(objectSorter);
  for (let i = 0; i < sortedA.length; i++) {
    if (!objectsAreEqual(sortedA[i], sortedB[i])) return false;
  }
  return true;
}

export function objectsAreEqual(
  a: { [key: string]: any },
  b: { [key: string]: any }
): boolean {
  for (let prop in a) {
    if (!(prop in b)) return false;
    if (typeof a[prop] === "object" && a[prop] !== null) {
      if (Array.isArray(a[prop]) && Array.isArray(b[prop])) {
        if (!arraysOfObjectsAreEqual(a[prop], b[prop])) return false;
      } else if (!objectsAreEqual(a[prop], b[prop])) return false;
    } else {
      if (a[prop] !== b[prop]) return false;
    }
  }
  for (let prop in b) {
    if (!(prop in a)) return false;
  }
  return true;
}

function objectSorter(
  a: { [key: string]: any },
  b: { [key: string]: any }
): number {
  const aProps = Object.keys(a).sort();
  const bProps = Object.keys(b).sort();
  for (let i = 0; i < aProps.length; i++) {
    if (aProps[i] !== bProps[i]) return aProps[i] < bProps[i] ? -1 : 1;
    if (a[aProps[i]] < b[bProps[i]]) return -1;
    if (a[aProps[i]] > b[bProps[i]]) return 1;
  }
  return 0;
}
