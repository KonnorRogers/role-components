// @ts-check

import { LitElement } from "lit";
import { DefineableMixin } from "web-component-define";
import { uuidv4 } from "./uuid.js";
import { LanguageObserver } from "./language-observer.js";

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

/**
 * Base class
 */
export class BaseElement extends DefineableMixin(LitElement) {
  /**
   * @type {Record<string, typeof HTMLElement>}
   */
  static get dependencies () {
    return {}
  }

  /**
   * @param {...any[]} args
   */
  constructor(...args) {
    /** @ts-expect-error allows us to play nice with mixins. */
    super(...args);

    Object.entries(/** @type {typeof BaseElement} */ (this.constructor).dependencies).forEach(([key, ctor]) => {
      if (!customElements.get(key)) {
        customElements.define(key, ctor)
      }
    })

    this.textDirection = "ltr"

    /** @type {EventHandler<this>} */
    this.eventHandler = new EventHandler(this);

    this.languageObserver = new LanguageObserver(this).start()

    this.languageObserver.handleLangChange = () => {
      const oldDirection = this.textDirection
      this.textDirection = this.getTextDirection()
      this.requestUpdate("textDirection", oldDirection)
    }

    this.languageObserver.handleDirChange = () => {
      const oldDirection = this.textDirection
      this.textDirection = this.getTextDirection()
      this.requestUpdate("textDirection", oldDirection)
    }

    /**
     * @type {null | Map<any, ReturnType<typeof setTimeout>>}
     */
    this.__debounceMap__ = null;

    if (!this.internals) {
      /**
       * @type {ReturnType<HTMLElement["attachInternals"]>}
       */
      this.internals = this.attachInternals()
    }

  }

  /**
   * Assign a random UUID with a prefix if no id is found. Will return the "id" of the element if its already assigned.
   * @param {string} [prefix=""] - Prefix to add to the uuid
   * @param {boolean} [force=false] - If true, will not check if `this.id` already exists.
   * @returns {string}
   */
  getOrAssignId (prefix = "", force = false) {
    let str = this.id

    if (!str || force) {
      str = prefix + "-" + uuidv4()
      this.id = str
    }
    return str
  }

  /**
   * @returns {"ltr" | "rtl"}
   */
  getTextDirection () {
    return this.matches(":dir(rtl)") ? "rtl" : "ltr"
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.__debounceMap__ = null
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
   * @template {keyof ARIAMixin} T
   * @param {T} key
   * @param {ARIAMixin[T]} value
   */
  setAria (key, value) {
    this.internals[key] = value
    this[key] = value
  }
}
