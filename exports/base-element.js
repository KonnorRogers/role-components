// @ts-check

import { LitElement } from "lit";
import { DefineableMixin } from "web-component-define";

export class BaseElement extends DefineableMixin(LitElement) {
  constructor() {
    super();

    /**
     * @type {Map<(this: HTMLElement, evt: HTMLElementEventMap[keyof HTMLElementEventMap]) => any, {handleEvent: HTMLElementEventMap[keyof HTMLElementEventMap]}> | null}
     */
    this.__eventMap__ = null;

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

  /**
   * @template K
   * @param {K extends keyof HTMLElementEventMap ? keyof HTMLElementEventMap : never} type
   * @param {K extends keyof HTMLElementEventMap ? ((this: HTMLElement, evt: HTMLElementEventMap[K]) => any) : never } callback
   * @param {boolean | AddEventListenerOptions} [options]
   * @returns {void}
   */
  addEventListener(type, callback, options) {
    if (typeof callback !== "function") {
      super.addEventListener(type, callback, options);
      return;
    }

    if (this.__eventMap__ == null) this.__eventMap__ = new Map();

    /** @type {K extends keyof HTMLElementEventMap ? (this: HTMLElement, ev: HTMLElementEventMap[K]) => any : never} */
    // @ts-expect-error
    let event = this.__eventMap__.get(callback);

    if (event == null) {
      const self = this;
      const toEvent = {
        /**
         * @param {HTMLElementEventMap[type]} evt
         */
        handleEvent(evt) {
          /** @type {K extends keyof HTMLElementEventMap ? (this: HTMLElement, ev: HTMLElementEventMap[K]) => any : never} */
          // @ts-expect-error
          callback.call(self, evt);
        },
      };

      /** @type {K extends keyof HTMLElementEventMap ? (this: HTMLElement, ev: HTMLElementEventMap[K]) => any : never} */
      // @ts-expect-error
      this.__eventMap__.set(callback, toEvent);

      /** @type {K extends keyof HTMLElementEventMap ? (this: HTMLElement, ev: HTMLElementEventMap[K]) => any : never} */
      // @ts-expect-error
      event = toEvent;
    }

    // @ts-expect-error
    super.addEventListener(type, event, options);
  }

  /**
   * @param {Parameters<HTMLElement["removeEventListener"]>} args
   * @returns {ReturnType<HTMLElement["removeEventListener"]>}
   */
  removeEventListener(...args) {
    const [type, callback, options] = args;

    if (typeof callback !== "function" || this.__eventMap__ == null) {
      super.removeEventListener(type, callback, options);
      return;
    }

    let event = this.__eventMap__.get(callback);

    if (event == null) {
      super.removeEventListener(type, callback, options);
      return;
    }

    // @ts-expect-error
    super.removeEventListener(type, event, options);
  }
}
