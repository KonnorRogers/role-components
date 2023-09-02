// @ts-check
import { BaseElement } from "../base-element.js";

import {
  arrow,
  computePosition,
  flip,
  shift,
  offset,
  autoUpdate,
} from "@floating-ui/dom";

import { css, html } from "lit"

/**
 * Due to accessibility reasons with aria-describedby, the tooltip must be the same
 *   document / shadowRoot as the item being described by the tooltip.
 * @customElement
 * @example
 *   <role-tooltip id="my-tooltip">I'm a tooltip!</role-tooltip>
 *   <button aria-describedby="my-tooltip">Button</button>
 * @slot - default slot
 * @cssprop [--background-color=#222]
 * @cssprop [--arrow-size=8px]
 */
export default class RoleTooltip extends BaseElement {
  static get properties() {
    return {
      id: { reflect: true },
      tooltipAnchors: { state: true },
      rootElement: { state: true },
      role: { reflect: true },
      inert: { reflect: true, type: Boolean },
      placement: { reflect: true }
    }
  }

  /** @returns {string} */
  static get baseName() {
    return "role-tooltip";
  }

  static get styles() {
    return css`
      :host {
        --background-color: #222;
        --arrow-size: 8px;
      }

      .base {
        display: none;
        position: absolute;
        left: 0px;
        top: 0px;
        max-width: calc(100vw - 10px);
        padding: 0.4em 0.6em;
        background: var(--background-color);
        color: white;
        border-radius: 4px;
        font-size: 0.9em;
        pointer-events: none;
        z-index: 1;
      }

      :host([hoist]) .base {
        position: fixed;
      }

      .arrow {
        position: absolute;
        background: var(--background-color);
        width: var(--arrow-size);
        height: var(--arrow-size);
        transform: rotate(45deg);
      }
    `;
  }

  constructor() {
    super();

    // Needed by floating-ui
    // @ts-expect-error
    if (window.process == null) window.process = {}
    // @ts-expect-error
    if (window.process.env == null) window.process.env = "development"

    /**
     * @type {Element[]}
     */
    this.tooltipAnchors = [];

    /**
     * @type {ShadowRoot | Document | undefined}
     */
    this._rootElement = undefined

    this.role = "tooltip"
    this.inert = true

    /**
     * @type {import("@floating-ui/dom").Placement}
     */
    this.placement = "top"

    /**
     * @type {Array<[keyof GlobalEventHandlersEventMap, (evt: Event | KeyboardEvent) => void]>}
     */
    this.listeners = [
      ["pointerenter", this.show],
      ["pointerleave", this.hide],
      ["pointercancel", this.hide],
      ["pointerup", this.hide],
      ["focusin", this.show],
      ["focusout", this.hide],
      ["keydown", this.keyboardHide],
    ];
  }

  connectedCallback () {
    super.connectedCallback()

    this.updateAnchors()

    this.attachListeners()
  }

  updateAnchors () {
    if (this.rootElement) {
      this.tooltipAnchors = Array.from(this.rootElement.querySelectorAll(this.query)) || []
    }
  }

  disconnectedCallback () {
    super.disconnectedCallback()

    this.removeListeners()
  }

  /**
   * @type {string}
   */
  get query () {
    return `[aria-describedby~='${this.id}']`;
  }

  /** @returns {ShadowRoot | Document | undefined} */
  get rootElement() {
    if (this._rootElement == null) {
      const oldVal = this._rootElement

      /**
      * @type {ShadowRoot | Document | undefined}
      */
      // @ts-expect-error
      this._rootElement = this.getRootNode() || document;
      this.requestUpdate("rootElement", oldVal)
    }

    return this._rootElement;
  }

  /** @returns {void} */
  set rootElement(newVal) {
    const oldVal = this._rootElement;

    this._rootElement = newVal;
    this.requestUpdate("rootElement", oldVal)
  }

  render() {
    return html`
      <div part="base" class="base">
        <slot></slot>
        <div class="arrow" part="arrow"></div>
      </div>
    `;
  }

  /**
   * @param {Parameters<import("lit").LitElement["update"]>} args
   * @return {ReturnType<import("lit").LitElement["update"]>}
   */
  update (...args) {
    const [changedProperties] = args

    const shouldUpdateProperties = ["id", "tooltipAnchors", "rootElement"]
    const shouldReattachListeners = shouldUpdateProperties.some((str) => changedProperties.has(str))

    if (shouldReattachListeners) {
      this.attachListeners()
    }

    super.update(...args)
  }


  /**
   * Used for re-initialized event listeners
   * @returns {void}
   */
  attachListeners() {
    this.listeners.forEach(([event, listener]) => {
      // Remove listeners. Do it in the same loop for perf stuff.

      // In case there's old anchors
      this.tooltipAnchors.forEach((el) =>
        el.removeEventListener(event, listener)
      );

      // Attach to new anchors
      this.tooltipAnchors.forEach((el) => el.addEventListener(event, listener));
    });
  }

  /**
   * Used for cleaning up
   * @returns {void}
   */
  removeListeners() {
    this.listeners.forEach(([event, listener]) => {
      // don't recompute anchors.
      this.tooltipAnchors.forEach((el) =>
        el.removeEventListener(event, listener)
      );
    });
  }

  /** @returns {HTMLElement | undefined | null} */
  get arrow() {
    return this.shadowRoot?.querySelector(".arrow");
  }

  /**
   * @param {Event|Element} eventOrElement
   * @returns {void}
   */
  show = (eventOrElement) => {
    if (eventOrElement instanceof Event && eventOrElement.currentTarget instanceof Element) {
      eventOrElement = eventOrElement.currentTarget;
    }

    /**
     * @type {Element}
     */
    // @ts-expect-error
    const target = eventOrElement

    this.willShow = true;

    this.computeTooltipPosition(target);
  };

  /**
   * @param {Event} [_event]
   * @returns {void}
   */
  hide = (_event) => {
    this.willShow = false;
    this.cleanup?.();

    window.requestAnimationFrame(() => {
      if (this.willShow === true) return;

      const base = this.base

      if (!base) return

      base.style.display = "none";
    });
  };

  /**
   * @param {Event | KeyboardEvent} event
   */
  keyboardHide = (event) => {
    if (!("key" in event)) { return }
    if (event.key != null && event.key.toLowerCase() === "escape") {
      event.preventDefault();
      this.hide();
    }
  };

  /**
   * @param {Element} target
   * @returns {void}
   */
  computeTooltipPosition(target) {
    const arrowEl = this.arrow;
    const base = this.base;

    if (base == null) return
    if (arrowEl == null) return

    base.style.display = "unset";

    const placement = this.placement || "top"

    this.cleanup = autoUpdate(target, base, () => {
      computePosition(target, base, {
        placement,
        middleware: [
          offset(6),
          flip(),
          shift({ padding: 5 }),
          arrow({ element: arrowEl }),
        ],
        strategy: this.hasAttribute("hoist") ? "fixed" : "absolute",
      }).then(({ x, y, middlewareData, placement }) => {
        Object.assign(base.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        const arrowX = middlewareData.arrow?.x
        const arrowY = middlewareData.arrow?.y

        // Always the opposite of the placement the user provides.
        const staticSide = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right",
        }[placement.split("-")[0]] || "top";

        Object.assign(arrowEl.style, {
          left: arrowX != null ? `${arrowX}px` : "",
          top: arrowY != null ? `${arrowY}px` : "",
          right: "",
          bottom: "",
          [staticSide]: "-4px",
        });
      });
    });
  }


 /**
  * @return {HTMLElement | null | undefined}
  */
  get base() {
    return this.shadowRoot?.querySelector(".base");
  }
}
