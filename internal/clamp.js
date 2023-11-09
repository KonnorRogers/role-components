/**
 * If current > max, return max
 * If current < min, return min
 * @param {number} min
 * @param {number} current
 * @param {number} max
 * @return {number}
 */
export function clamp(min, current, max) {
  return Math.min(Math.max(current, min), max);
}
