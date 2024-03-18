/**
 * @template {(...args: any[]) => any} T
 * @param {T} callback
 * @param {number} wait
 */
export function debounce (callback, wait) {
  /** @type {null | ReturnType<typeof setTimeout>} */
  let timeoutId = null;

  /**
   * @param {Parameters<T>} args
   */
  return (...args) => {
    if (timeoutId != null) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}
