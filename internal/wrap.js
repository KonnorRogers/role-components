/**
 * If current > max, return min
 * If current < min, return max
 * @param {number} min
 * @param {number} current
 * @param {number} max
 * @return {number}
 */
export function wrap(min, current, max) {
  if (current > max) {
    return min;
  }

  if (current < min) {
    return max;
  }

  return current;
}
