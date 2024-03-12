// @ts-check

import { LitElement } from "lit";
import { DefineableMixin } from "web-component-define";

/**
 * @template {HTMLElement} T
 */
class EventHandler {
  /**
   * @param {T} element
   */
  constructor (element) {
    /**
     * @type {T}
     */
    this.element = element

    /**
     * @type {WeakMap<EventHandlerFunction, EventHandlerFunction>}
     */
    this.events = new WeakMap()
  }

  /**
   * @param {EventHandlerFunction} fn
   */
  get (fn) {
    let handler = this.events.get(fn)
    if (!handler) {
      handler = (...args) => fn.apply(this.element, args)
      this.events.set(fn, handler)
    }

    return handler
  }

}

/** @typedef {(...args: any[]) => any} EventHandlerFunction */

export class BaseElement extends DefineableMixin(LitElement) {
  /**
   * @type {Record<string, typeof HTMLElement>}
   */
  static get dependencies () {
    return {}
  }

  constructor() {
    super();

    Object.entries(/** @type {typeof BaseElement} */ (this.constructor).dependencies).forEach(([key, ctor]) => {
      if (!customElements.get(key)) {
        customElements.define(key, ctor)
      }
    })

    /** @type {EventHandler<this>} */
    this.eventHandler = new EventHandler(this);

    /**
     * @type {null | Map<any, ReturnType<typeof setTimeout>>}
     */
    this.__debounceMap__ = null;
  }

  /**
   * @param {(...args: any[]) => any} callback
   * @param {{ key: any, wait: number }} options
   * @return {ReturnType<typeof setTimeout>}
   */
  debounce(callback, options) {
    if (this.__debounceMap__ == null) {
      this.__debounceMap__ = new Map();
    }

    let timeout = this.__debounceMap__.get(options.key);

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      callback();
    }, options.wait);

    this.__debounceMap__.set(options.key, timeout);

    return timeout;
  }
}
