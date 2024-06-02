// @ts-check
export class BaseEvent extends Event {
  /**
   * @param {string} name
   * @param {EventInit} options
   */
  constructor(name, options) {
    if (options == null) options = {};
    if (options.bubbles == null) options.bubbles = true;
    if (options.composed == null) options.composed = true;
    if (options.cancelable == null) options.cancelable = false;
    super(name, options);
  }
}
