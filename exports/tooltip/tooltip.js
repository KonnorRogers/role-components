// @ts-check
import { BaseElement } from "../base-element.js";
import { hostStyles } from "../styles/host-styles.js";

import { css, html } from "lit";


import RolePopover, {
  PopoverProperties,
  PopoverMixin,
} from "../popover/popover.js"

/**
 * Due to accessibility reasons with aria-describedby, the tooltip must be the same
 *   document / shadowRoot as the item being described by the tooltip.
 * @customElement
 * @tagname role-tooltip
 * @example
 *   ```js
 *   <role-tooltip id="my-tooltip">I'm a tooltip!</role-tooltip>
 *   <button aria-describedby="my-tooltip">Button</button>
 *   ```
 *
 * @slot - default slot
 * @cssprop [--background-color=#222]
 * @cssprop [--arrow-size=8px]
 */
export default class RoleTooltip extends PopoverMixin(BaseElement) {
  static dependencies = {
    'role-popover': RolePopover
  }

  static get properties() {
    return {
      ...(PopoverProperties()),
      id: { reflect: true },
      tooltipAnchors: { state: true },
      rootElement: { state: true },
      role: { reflect: true },
      placement: { reflect: true },
      currentPlacement: { attribute: "current-placement", reflect: true },
      active: { reflect: true, type: Boolean },
      __anchor: { attribute: false, state: true },
      __triggerSource: { attribute: false, state: true },
    };
  }

  /** @returns {string} */
  static get baseName() {
    return "role-tooltip";
  }

  static get styles() {
    return [
      hostStyles,
      css`
        :host {
          --background: #222;
          --border-color: transparent;
          --border-width: 1px;
          --arrow-size: 8px;
          color: white;
          display: contents;
        }

        [part~="base"]::part(popover) {
          padding: 0.2em 0.4em;
          border-radius: 4px;
        }
      `,
    ];
  }

  constructor() {
    super();

    /**
     * @type {Element[]}
     */
    this.tooltipAnchors = [];

    /**
     * @type {ShadowRoot | Document | undefined}
     */
    this._rootElement = undefined;

    this.role = "tooltip";
    this.active = false

    /**
     * @private
     * If the tooltip was trigger by focus
     * @type {null | "focus" | "hover"}
     */
    this.__triggerSource = null

    /**
     * @private
     * @type {null | Element}
     */
    this.__anchor = null

    this.arrow = true

    this.distance = 10

    const show = this.eventHandler.get(this.show)
    const hide = this.eventHandler.get(this.hide)
    const keyboardHide = this.eventHandler.get(this.keyboardHide)

    /**
     * @type {Array<[keyof GlobalEventHandlersEventMap, (evt: Event | KeyboardEvent) => void]>}
     */
    this.listeners = [
      ["pointerenter", show],
      ["pointercancel", hide],
      ["click", hide],
      ["focusin", show],
      ["focusout", hide],
      ["keydown", keyboardHide],
    ];

  }

  connectedCallback() {
    super.connectedCallback();

    this.updateAnchors();

    this.attachListeners();
  }

  updateAnchors() {
    if (this.rootElement) {
      this.tooltipAnchors =
        Array.from(this.rootElement.querySelectorAll(this.query)) || [];
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeListeners();
  }

  /**
   * @type {string}
   */
  get query() {
    return `[aria-describedby~='${this.id}']`;
  }

  /** @returns {ShadowRoot | Document | undefined} */
  get rootElement() {
    if (this._rootElement == null) {
      const oldVal = this._rootElement;

      /**
       * @type {ShadowRoot | Document | undefined}
       */
      // @ts-expect-error
      this._rootElement = this.getRootNode() || document;
      this.requestUpdate("rootElement", oldVal);
    }

    return this._rootElement;
  }

  /** @returns {void} */
  set rootElement(newVal) {
    const oldVal = this._rootElement;

    this._rootElement = newVal;
    this.requestUpdate("rootElement", oldVal);
  }

  render() {
    return html`
      <role-popover
        part="${`base ${this.active ? "popover--active" : ""}`}"
        exportparts="
          popover,
          arrow
        "
        .anchor=${this.__anchor}
        .active=${this.active}
        .placement=${this.placement}
        .strategy=${this.strategy}
        .distance=${this.distance}
        .skidding=${this.skidding}
        .arrow=${this.arrow}
        .arrowPlacement=${this.arrowPlacement}
        .arrowPadding=${this.arrowPadding}
        .flip=${this.flip}
        .flipFallbackPlacements=${this.flipFallbackPlacements}
        .flipFallbackStrategy=${this.flipFallbackStrategy}
        .flipBoundary=${this.flipBoundary}
        .flipPadding=${this.flipPadding}
        .shift=${this.shift}
        .shiftBoundary=${this.shiftBoundary}
        .shiftPadding=${this.shiftPadding}
        .autoSize=${this.autoSize}
        .sync=${this.sync}
        .autoSizeBoundary=${this.autoSizeBoundary}
        .autoSizePadding=${this.autoSizePadding}
        .hoverBridge=${this.hoverBridge}
        class="${this.active ? '' : 'visually-hidden'}"
      >
        <slot></slot>
      </role-popover>
    `;
  }

  /**
   * @param {Parameters<import("lit").LitElement["update"]>} args
   * @return {ReturnType<import("lit").LitElement["update"]>}
   */
  update(...args) {
    const [changedProperties] = args;

    const shouldUpdateProperties = ["id", "tooltipAnchors", "rootElement"];
    const shouldReattachListeners = shouldUpdateProperties.some((str) =>
      changedProperties.has(str),
    );

    if (shouldReattachListeners) {
      this.attachListeners();
    }

    super.update(...args);
  }

  /**
   * Used for re-initialized event listeners
   * @returns {void}
   */
  attachListeners() {
    document.addEventListener("pointermove", this.eventHandler.get(this.hide), {passive: true })

    this.listeners.forEach(([event, listener]) => {
      // Remove listeners. Do it in the same loop for perf stuff.

      // In case there's old anchors
      this.tooltipAnchors.forEach((el) =>
        el.removeEventListener(event, listener),
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
    // @ts-expect-error
    document.removeEventListener("pointermove", this.eventHandler.get(this.hide), { passive: true })

    this.listeners.forEach(([event, listener]) => {
      // don't recompute anchors.
      this.tooltipAnchors.forEach((el) =>
        el.removeEventListener(event, listener),
      );
    });
  }

  /**
   * @param {Event|Element} eventOrElement
   * @returns {void}
   */
  show = (eventOrElement) => {
    /**
     * Used to track how to close the tooltip.
     * @type {typeof this.__triggerSource}
     */
    let triggerSource = null

    /**
     * @type {null | Element}
     */
    let element = null

    if (
      eventOrElement instanceof Event
    ) {

      if (eventOrElement.currentTarget instanceof Element) {
        /**
        * pointer* -> hover
        * focus* -> focus
        */
        triggerSource = eventOrElement.type.startsWith("pointer") ? "hover" : "focus"
        element = eventOrElement.currentTarget;
      }
    } else {
      element = eventOrElement
    }

    if (!element) { return }

    // We only want to overwrite `__triggerSource` if its not "focus", "focus" takes priority over everything.
    if (this.__triggerSource !== "focus") {
      this.__triggerSource = triggerSource
    }

    this.willShow = true;
    this.__anchor = element
    this.active = true
  };

  /**
   * @param {Event} [event]
   * @returns {void}
   */
  hide = (event) => {
    if (event && event.type === "pointermove") {
      const composedPath = event.composedPath()
      if (composedPath.includes(this) || (this.__anchor && composedPath.includes(this.__anchor))) {
        return
      }
    }
    /**
     * @type {typeof this.__triggerSource}
     */
    let eventTriggerSource = null

    if (event) {
      eventTriggerSource = event.type.startsWith("pointer") ? "hover" : "focus"
    }

    // We don't want to hide the tooltip if it was triggered by focus.
    if (this.__triggerSource === "focus" && eventTriggerSource === "hover") {
      return
    }

    /**
     * Reset the trigger source before we start to hide everything.
     */
    this.__triggerSource = null

    this.willShow = false;

    window.requestAnimationFrame(() => {
      if (this.willShow === true) return;

      this.active = false
      this.__anchor = null
    });
  };

  /**
   * @param {Event | KeyboardEvent} event
   */
  keyboardHide = (event) => {
    if (!("key" in event)) {
      return;
    }

    if (event.key != null && event.key === "Escape") {
      event.preventDefault();
      this.hide();
    }
  };
}
