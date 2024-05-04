// @ts-check
import { BaseElement } from "../base-element.js";
import { hostStyles } from "../styles/host-styles.js";

import { css, html } from "lit";


import RoleAnchoredRegion, {
  AnchoredRegionProperties,
  AnchoredRegionMixin,
} from "../anchored-region/anchored-region.js"


/**
 * This is a polyfill until popovers support "triggerElements"
 * @param {Event} e
 */
function handlePopoverTriggerClick (e) {
  const triggerElement = /** @type {HTMLElement} */ (e.target).closest("[popovertarget]")

  if (!triggerElement) { return }

  const rootNode = /** @type {Element} */ (triggerElement.getRootNode())

  const popoverTarget = triggerElement.getAttribute("popovertarget")

  if (!popoverTarget) { return }

  const popover = rootNode.querySelector(`#${popoverTarget}`)

  if (!popover) { return }

  const roleToggleEvent = new Event("role-popover-trigger", {
    bubbles: true,
    composed: true,
    cancelable: false,
  })

  roleToggleEvent.triggerElement = triggerElement
  popover.dispatchEvent(roleToggleEvent)
}

/**
 * @param {Document | ShadowRoot} rootNode
 */
function patchRootNode (rootNode) {
  // @ts-expect-error
  if (rootNode.__POPOVER_PATCHED_BY_ROLE_COMPONENTS__) {
    return
  }

  // @ts-expect-error
  rootNode.__POPOVER_PATCHED_BY_ROLE_COMPONENTS__ = true
  rootNode.addEventListener("click", handlePopoverTriggerClick)
}



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
export default class RoleTooltip extends AnchoredRegionMixin(BaseElement) {
  static dependencies = {
    'role-anchored-region': RoleAnchoredRegion
  }

  static get properties() {
    return {
      ...(AnchoredRegionProperties()),
      id: { reflect: true },
      tooltipAnchors: { state: true },
      role: { reflect: true },
      placement: { reflect: true },
      currentPlacement: { attribute: "current-placement", reflect: true },
      active: { reflect: true, type: Boolean },
      popover: { reflect: true },
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
          margin: 0;
        }

        :host(:not([active])) {
          display: none;
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

    this.popover = "auto"

    /**
     * @type {Element[]}
     */
    this.tooltipAnchors = [];

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

    // const show = this.eventHandler.get(this.show)
    // const hide = this.eventHandler.get(this.hide)

    // this.listeners = [
    //   ["pointerenter", show],
    //   ["pointermove", hide],
    //   // ["pointerleave", hide],
    //   // ["pointercancel", hide],
    //   // ["pointerup", hide],
    //   ["focusin", show],
    //   ["focusout", hide],
    // ];

    this.__anchor = null

    this.addEventListener("role-popover-trigger", (e) => {
      this.__anchor = e.triggerElement
      this.__triggerSource = "focus"
    })

    this.addEventListener("beforetoggle", (e) => {
      this.active = !(this.matches(":popover-open"))
    })

    this.addEventListener("role-reposition", () => {
      const anchoredRegion = this.anchoredRegion

      if (!anchoredRegion) { return }

      const popoverElement = anchoredRegion.popoverElement

      if (!popoverElement) { return }

      window.requestAnimationFrame(() => {
        const { height, width, left, top } = popoverElement.getBoundingClientRect()

        this.style.minHeight = `${height}px`
        this.style.minWidth = `${width}px`
        this.style.left = `${left}px`
        this.style.top = `${top}px`
      })
    })

  }

  get anchoredRegion () {
    return /** @type {RoleAnchoredRegion | null} */ (this.shadowRoot?.querySelector("[part~='base']") || null)
  }

  connectedCallback() {
    super.connectedCallback();

    const rootNode = /** @type {Document | ShadowRoot} */ (this.getRootNode())
    patchRootNode(rootNode)

    if (this.__eventAbortController == null) {
      this.__eventAbortController = new AbortController()
    }

    const { signal } = this.__eventAbortController

    rootNode.addEventListener("focusin", this.eventHandler.get(this.show), { signal })
    rootNode.addEventListener("focusout", this.eventHandler.get(this.hide), { signal })

    rootNode.addEventListener("pointerover", this.eventHandler.get(this.show), { passive: true, signal })

    rootNode.addEventListener("pointermove", this.eventHandler.get(this.hide), { passive: true, signal })
    document.addEventListener("pointermove", this.eventHandler.get(this.hide), { passive: true, signal })
  }

  /**
   * @param {Event} e
   */
  findPopoverTriggerFromEvent (e) {
    const composedPath = e.composedPath()

    const popoverTrigger = /** @type {Element} */ (composedPath.find((el) => "getAttribute" in el && /** @type {Element} */ (el).getAttribute("popovertarget") === this.id))

    return (popoverTrigger || null)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.__eventAbortController?.abort()
  }

  render() {
    return html`
      <role-anchored-region
        part="${`base ${this.active ? "popover--active" : ""}`}"
        exportparts="
          popover,
          hover-bridge,
          hover-bridge--visible,
          popover--active,
          popover--fixed,
          popover--has-arrow,
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
      </role-anchored-region>
    `;
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
      /**
      * pointer* -> hover
      * focus* -> focus
      */
      triggerSource = eventOrElement.type.startsWith("pointer") ? "hover" : "focus"
      element = this.findPopoverTriggerFromEvent(eventOrElement)
    } else {
      element = eventOrElement
    }

    if (!element) { return }

    // We only want to overwrite `__triggerSource` if its not "focus", "focus" takes priority over everything.
    if (this.__triggerSource !== "focus") {
      this.__triggerSource = triggerSource
    }

    // if (this.__triggerSource === "focus") {
    //   this.addEventListener()
    // }

    this.__anchor = element
    this.showPopover()
    this.active = true
  };

  /**
   * @param {Event} [event]
   * @returns {void}
   */
  hide = (event) => {
    if (event && event.type.startsWith("pointer")) {
      const composedPath = event.composedPath()
      if (
        composedPath.includes(this) ||
        (this.__anchor && composedPath.includes(this.__anchor))
      ) {
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
    if (this.active && this.__triggerSource === "focus" && eventTriggerSource === "hover") {
      return
    }

    /**
     * Reset the trigger source before we start to hide everything.
     */
    this.__triggerSource = null

    this.hidePopover()
    this.active = false
  };
}
