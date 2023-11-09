/**
 * @param {Record<string, unknown>} obj
 * @return {string}
 */
export function stringMap(obj) {
  let string = "";

  for (const [key, value] of Object.entries(obj)) {
    if (Boolean(value)) {
      string += `${key} `;
    }
  }

  return string;
}
