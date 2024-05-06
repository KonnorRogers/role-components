// @ts-check
import { BaseElement } from "../base-element.js";
import { hostStyles } from "../styles/host-styles.js";

import { css, html } from "lit";


import RoleAnchoredRegion, {
  AnchoredRegionProperties,
  AnchoredRegionMixin,
} from "../anchored-region/anchored-region.js"

import { BaseEvent } from "../events/base-event.js";

/**
 * @param {Event} e
 */
function findTriggerElementFromEvent (e) {
  const triggerElement = /** @type {HTMLElement} */ (e.target).closest("[popovertarget]")

  if (!triggerElement) { return null }

  return triggerElement
}

/**
 * @param {Element} triggerElement
 */
function findPopoverElementFromTriggerElement (triggerElement) {
  const rootNode = /** @type {Element} */ (triggerElement.getRootNode())

  const popoverTarget = triggerElement.getAttribute("popovertarget")

  if (!popoverTarget) { return null }

  const popover = rootNode.querySelector(`#${popoverTarget}`)

  if (!popover) { return null }

  return popover
}

/**
 * This is a polyfill until popovers supports "triggerElements"
 * @param {Event} e
 */
function patchPopoverTriggerClick (e) {
  const triggerElement = findTriggerElementFromEvent(e)

  if (!triggerElement) return

  const popoverElement = findPopoverElementFromTriggerElement(triggerElement)

  if (!popoverElement) return

  const roleToggleEvent = new RolePopoverTriggerEvent("role-popover-trigger", {
    triggerElement
  })

  // Dispatch the toggle event to the popover, rather than the trigger.
  popoverElement.dispatchEvent(roleToggleEvent)
}

/**
 * A "ponyfill" event for grabbing a popover trigger
 */
class RolePopoverTriggerEvent extends BaseEvent {
  /**
   * @param {string} eventName
   * @param {EventInit & {triggerElement: Element}} init
   */
  constructor (eventName, init) {
    super(eventName, init)

    /**
     * @type {Element}
     */
    this.triggerElement = init.triggerElement
  }
}

/**
 * @param {Document | ShadowRoot} rootNode
 */
function patchRootNode (rootNode) {
  rootNode.addEventListener("click", patchPopoverTriggerClick)
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
      role: { reflect: true },
      placement: { reflect: true },
      active: { reflect: true, type: Boolean },
      popover: { reflect: true },
      anchor: { attribute: false, state: true },
      triggerSource: { attribute: "trigger-source", reflect: true },
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
          border: none;
          background: transparent;
          display: contents;
        }

        :host([active]) [part~="anchored-region"]::part(popover) {
          opacity: 1;
          transform: scale(1.0);
        }

        :host([active][trigger-source="hover"]) [part~="anchored-region"]::part(popover) {
          transition:
            opacity var(--transition-speed, 200ms) var(--transition-timing, ease-in-out) var(--transition-delay, 100ms),
            transform var(--transition-speed, 200ms) var(--transition-timing, ease-in-out) var(--transition-delay, 100ms);
        }

        [part~="anchored-region"]::part(popover) {
          opacity: 0;
          transform: scale(0.8);
          padding: 0.2em 0.4em;
          border-radius: 4px;
        }
      `,
    ];
  }

  constructor () {
    super()
    /**
    * A popover attribute can have values "auto" (default) or "manual". Popovers that have the auto state can be "light dismissed" by selecting outside the popover area, and generally only allow one popover to be displayed on-screen at a time. By contrast, manual popovers must always be explicitly hidden, but allow for use cases such as nested popovers in menus
    * @type {"manual" | "auto"}
    */
    this.popover = "auto"

    /**
    * The "role" attribute. Default is "tooltip" and generally shouldn't be overriden.
    * @type {string}
    */
    this.role = "tooltip";

    /**
    * Whether or not to show the tooltip
    * @type {boolean}
    */
    this.active = false

    /**
    * @private
    * If the tooltip was trigger by focus
    * @type {null | "focus" | "hover"}
    */
    this.triggerSource = null

    this.arrow = true
    this.distance = 10

    /**
    * @type {Element | null}
    */
    this.anchor = null

    this.addEventListener("role-popover-trigger", this.eventHandler.get(this.handlePopoverTriggerEvent))
    this.addEventListener("toggle", this.eventHandler.get(this.handleToggle))
    this.addEventListener("role-reposition", this.eventHandler.get(this.handleReposition))
  }

  /**
   * @param {RolePopoverTriggerEvent} e
   */
  handlePopoverTriggerEvent (e) {
    this.anchor = e.triggerElement
    this.triggerSource = "focus"
  }

  handleReposition () {
    const anchoredRegion = this.anchoredRegion

    if (!anchoredRegion) { return }

    const popoverElement = anchoredRegion.popoverElement

    if (!popoverElement) { return }

    this.currentPlacement = this.anchoredRegion.currentPlacement

    window.requestAnimationFrame(() => {
      const { height, width, left, top } = popoverElement.getBoundingClientRect()

      this.style.minHeight = `${height}px`
      this.style.minWidth = `${width}px`
      this.style.left = `${left}px`
      this.style.top = `${top}px`
    })
  }

  /**
   * @param {ToggleEvent} e
   */
  handleToggle (e) {
    this.active = (e.newState === "open")
  }

  get popoverIsOpen () {
    return this.matches(":popover-open")
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

  disconnectedCallback () {
    super.disconnectedCallback()
    this.__eventAbortController?.abort()
  }

  render() {
    return html`
      <role-anchored-region
        part="anchored-region"
        exportparts="
          popover,
          hover-bridge,
          hover-bridge--visible,
          popover--active,
          popover--fixed,
          popover--has-arrow,
          arrow
        "
        .anchor=${this.anchor}
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
  show (eventOrElement) {
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
      element = findTriggerElementFromEvent(eventOrElement)
    } else {
      element = eventOrElement
    }

    if (!element) { return }

    // We only want to overwrite `__triggerSource` if its not "focus", "focus" takes priority over everything.
    if (this.triggerSource !== "focus") {
      this.triggerSource = triggerSource
    }

    this.anchor = element
    this.showPopover()
    this.active = true
  };

  /**
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate (changedProperties) {
    if (changedProperties.has("active")) {
      if (this.active) {
        // TLDR: we set aria-expanded in case the trigger isn't a button.
        // We use aria-describedby because aria-details isn't well supported.
        // https://hidde.blog/popover-accessibility/
        if (!this.popoverIsOpen) {
          this.showPopover()
        }
        this.anchor?.setAttribute("aria-expanded", "true")
        const ids = this.anchor?.getAttribute("aria-describedby") || ""
        if (!ids.split(/\s+/).includes(this.id)) {
          this.anchor?.setAttribute("aria-describedby", ids + " " + this.id)
        }
      } else {
        if (this.popoverIsOpen) {
          this.hidePopover()
        }
        this.anchor?.setAttribute("aria-expanded", "false")
      }
    }
  }

  /**
   * @param {Event} [event]
   * @returns {void}
   */
  hide (event) {
    if (event && event.type.startsWith("pointer")) {
      const composedPath = event.composedPath()
      if (
        composedPath.includes(this) ||
        (this.anchor && composedPath.includes(this.anchor))
      ) {
        return
      }
    }
    /**
     * @type {typeof this.triggerSource}
     */
    let eventTriggerSource = null

    if (event) {
      eventTriggerSource = event.type.startsWith("pointer") ? "hover" : "focus"
    }

    // We don't want to hide the tooltip if it was triggered by focus.
    if (this.active && this.triggerSource === "focus" && eventTriggerSource === "hover") {
      return
    }

    /**
     * Reset the trigger source before we start to hide everything.
     */
    this.triggerSource = null

    this.active = false
    this.hidePopover()
  };
}
