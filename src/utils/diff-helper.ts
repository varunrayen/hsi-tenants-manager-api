/**
 * Utility function to calculate differences between two objects
 * Returns an object with field paths and their before/after values
 */
export function calculateDiff(before: any, after: any, prefix = ''): Record<string, { from: any; to: any }> {
  const changes: Record<string, { from: any; to: any }> = {};

  if (!before && !after) {
    return changes;
  }

  if (!before) {
    // Object was created
    flattenObject(after, prefix).forEach(([path, value]) => {
      changes[path] = { from: null, to: value };
    });
    return changes;
  }

  if (!after) {
    // Object was deleted
    flattenObject(before, prefix).forEach(([path, value]) => {
      changes[path] = { from: value, to: null };
    });
    return changes;
  }

  const beforeFlat = new Map(flattenObject(before, prefix));
  const afterFlat = new Map(flattenObject(after, prefix));

  // Find all unique paths
  const allPaths = new Set([...beforeFlat.keys(), ...afterFlat.keys()]);

  allPaths.forEach(path => {
    const beforeValue = beforeFlat.get(path);
    const afterValue = afterFlat.get(path);

    if (!deepEqual(beforeValue, afterValue)) {
      changes[path] = {
        from: beforeValue !== undefined ? beforeValue : null,
        to: afterValue !== undefined ? afterValue : null
      };
    }
  });

  return changes;
}

/**
 * Flatten an object into dot-notation paths
 */
function flattenObject(obj: any, prefix = ''): Array<[string, any]> {
  const result: Array<[string, any]> = [];

  if (obj === null || obj === undefined) {
    return result;
  }

  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return [[prefix, obj]];
  }

  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined || typeof value !== 'object' || Array.isArray(value)) {
      result.push([path, value]);
    } else {
      result.push(...flattenObject(value, path));
    }
  });

  return result;
}

/**
 * Deep equality check for primitive values and arrays
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a === null || b === null || a === undefined || b === undefined) {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => deepEqual(a[key], b[key]));
  }

  return false;
}