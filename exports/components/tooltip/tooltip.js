// @ts-check
import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";

import { css, html } from "lit";


import RoleAnchoredRegion, {
  AnchoredRegionProperties,
  AnchoredRegionMixin,
} from "../anchored-region/anchored-region.js"

import { RoleTooltipToggleEvent } from "../../events/role-tooltip-toggle-event.js";

/**
 * @param {Event} e
 */
function findTriggerElementFromEvent (e) {
  const triggerElement = /** @type {HTMLElement[]} */ (e.composedPath()).find((el) => el.getAttribute?.("data-role-tooltip"))

  if (!triggerElement) { return null }

  return triggerElement
}

/**
 * @param {Element} triggerElement
 */
function findPopoverElementFromTriggerElement (triggerElement) {
  const rootNode = /** @type {Element} */ (triggerElement.getRootNode())

  const popoverTarget = triggerElement.getAttribute("data-role-tooltip")

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

  const roleToggleEvent = new RoleTooltipToggleEvent({
    triggerElement,
    triggerEvent: e
  })

  // Dispatch the toggle event to the popover, rather than the trigger.
  popoverElement.dispatchEvent(roleToggleEvent)
}

/**
 * Due to accessibility reasons with aria-labelledby, the tooltip must be the same
 *   document / shadowRoot as the item being described by the tooltip.
 * @customelement
 * @tagname role-tooltip
 * @example
 *   ```js
 *   <role-tooltip id="my-tooltip">I'm a tooltip!</role-tooltip>
 *   <button data-role-tooltip="my-tooltip">Button</button>
 *   ```
 *
 * @slot - default slot
 *
 * @cssprop [--background-color=#222]
 * @cssprop [--arrow-size=8px]
 *
 * @csspart popover
 * @csspart popover--active
 * @csspart popover--fixed
 * @csspart popover--has-arrow
 * @csspart arrow
 * @csspart hover-bridge
 * @csspart hover-bridge--visible
 */
export default class RoleTooltip extends AnchoredRegionMixin(BaseElement) {
  static dependencies = {
    'role-anchored-region': RoleAnchoredRegion
  }

  static get properties() {
    return {
      ...(AnchoredRegionProperties()),
      role: { reflect: true },
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
        @media screen and (prefers-color-scheme: dark) {
          :host {
            --border-color: CanvasText;
          }
        }

        @media screen and not (prefers-color-scheme: dark) {
          :host {
            --border-color: transparent;
          }
        }

        :host {
          --background: #222;
          --border-color: #222;
          --border-width: 2px;
          --arrow-size: 8px;
          color: white;
          margin: 0;
          border: none;
          background: transparent;
          display: inline-block;
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
    * @type {Element | null}
    */
    this.anchor = null

    // Purposely not commented to use the base class annotations.
    this.arrow = true
    this.distance = 10

    /**
    * @private
    * If the tooltip was trigger by focus
    * @type {null | "focus" | "hover" | "click"}
    */
    this.__triggerSource = null

    /**
     * @private
     */
    this.__eventAbortController = new AbortController()

    this.addEventListener("role-tooltip-toggle", this.eventHandler.get(this.handlePopoverTriggerEvent))
    this.addEventListener("role-reposition", this.eventHandler.get(this.handleReposition))

    document.addEventListener("click", patchPopoverTriggerClick)

    /**
     * @type {Element[]}
     */
    this.__activeElements = []
  }

  /**
   * @param {RoleTooltipToggleEvent} e
   */
  handlePopoverTriggerEvent (e) {
    this.active ? this.hide("click") : this.show(e.triggerElement, "click")
  }

  handleReposition () {
    const anchoredRegion = this.anchoredRegion

    if (!anchoredRegion) { return }

    const popoverElement = anchoredRegion.popoverElement

    if (!popoverElement) { return }

    this.currentPlacement = this.anchoredRegion.currentPlacement

    // window.requestAnimationFrame(() => {
    //   const { height, width, left, top } = popoverElement.getBoundingClientRect()

    //   this.style.minHeight = `${height}px`
    //   this.style.minWidth = `${width}px`
    //   this.style.left = `${left}px`
    //   this.style.top = `${top}px`
    // })
  }

  get anchoredRegion () {
    return /** @type {RoleAnchoredRegion | null} */ (this.shadowRoot?.querySelector("[part~='anchored-region']") || null)
  }

  connectedCallback() {
    super.connectedCallback();

    const { signal } = this.__eventAbortController
    const rootNode = /** @type {Document | ShadowRoot} */ (this.getRootNode())

    document.addEventListener("focusout", this.eventHandler.get(this.handleHide), { signal })
    rootNode.addEventListener("pointerover", this.eventHandler.get(this.handleShow), { passive: true, signal })

    rootNode.addEventListener("focusin", this.eventHandler.get(this.handleFocusChange), { passive: true, signal })
    rootNode.addEventListener("focusout", this.eventHandler.get(this.handleFocusChange), { passive: true, signal })
    document.addEventListener("focusin", this.eventHandler.get(this.handleFocusChange), { passive: true, signal })
    document.addEventListener("focusout", this.eventHandler.get(this.handleFocusChange), { passive: true, signal })
    document.addEventListener("keydown", this.eventHandler.get(this.handleKeyDown), { passive: true, signal })
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.__eventAbortController?.abort()
  }

  /**
   * @param {KeyboardEvent} e
   */
  handleKeyDown (e) {
    // hide the tooltip on ESC key.
    if (e.key === "Escape") {
      this.hide("focus")
      return
    }

    if (e.key === "Tab") {
      this.handleFocusChange()
    }
  }

  /**
   * This is a hack. Unfortunately, there's no reliable way to get the active elements from just "focusin" / "focusout"
   */
  handleFocusChange () {
    this.__activeElements = []

    /** @param {Element} activeElement */
    const addActiveElements = (activeElement) => {
      this.__activeElements.push(activeElement)

      const nextActiveElement = activeElement?.shadowRoot?.activeElement

      if (nextActiveElement) {
        addActiveElements(nextActiveElement)
      }
    }

    const rootNode = document.activeElement

    if (!rootNode) {
      this.hide("focus")
      return
    }

    addActiveElements(rootNode)

    const focusedElement = this.__activeElements.find((el) => {
      return el.getAttribute?.("data-role-tooltip") === this.id
    })

    if (focusedElement) {
      this.anchor = focusedElement
      this.active = true
      this.__triggerSource = "focus"
      return
    }

    this.hide("focus")
  }

  render() {
    return html`
      <role-anchored-region
        part="anchored-region"
        exportparts="
          popover,
          popover--active,
          popover--fixed,
          popover--has-arrow,
          arrow,
          hover-bridge,
          hover-bridge--visible
        "
        .anchor=${this.anchor}
        ?active=${this.active}
        .anchoredPopoverType=${this.anchoredPopoverType}
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
   * Used to show from event listeners.
   * @param {Event} event
   */
  handleShow (event) {
    /**
     * pointer* -> hover
     * focus* -> focus
     */
    const triggerSource = event.type.startsWith("pointer") ? "hover" : "focus"
    const triggerElement = this.findTriggerForTooltip(event)

    if (!triggerElement) return

    this.show(triggerElement, triggerSource)
  }

  /**
   * @param {Element} triggerElement
   * @param {RoleTooltip["__triggerSource"]} triggerSource
   * @returns {void}
   */
  show (triggerElement, triggerSource = null) {
    if (!triggerSource) { triggerSource = null }

    // We only want to overwrite `__triggerSource` if its not "focus", "focus" takes priority over everything.
    if (this.__triggerSource !== "focus") {
      this.__triggerSource = triggerSource
    }

    this.anchor = triggerElement
    this.active = true
  };

  /**
   * @param {Event} e
   */
  findTriggerForTooltip (e) {
    const target = /** @type {Element | null} */ (e.target)

    if (!target) { return null }

    const popoverTriggerElement = target.closest("[data-role-tooltip]")

    if (!popoverTriggerElement) { return null }

    const popoverTriggerAttribute = popoverTriggerElement.getAttribute?.("data-role-tooltip")

    if (!popoverTriggerAttribute) { return null }
    if (popoverTriggerAttribute !== this.id) { return null}

    return popoverTriggerElement
  }

  /**
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate (changedProperties) {
    if (changedProperties.has("active")) {
      const rootNode = /** @type {Document | ShadowRoot} */ (this.getRootNode())
      const { signal } = this.__eventAbortController

      if (this.active) {
        // for some reason we need pointermove both on the rootNode and on the document.
        // We wait until the popover is active before adding these.
        rootNode.addEventListener("pointermove", this.eventHandler.get(this.handleHide), { signal })
        document.addEventListener("pointermove", this.eventHandler.get(this.handleHide), { signal })

        // We use aria-describedby because aria-labelledby causes content to get skipped.
        if (this.anchor instanceof Element) {
          const ids = this.anchor?.getAttribute("aria-describedby") || ""
          if (!ids) {
            this.anchor?.setAttribute("aria-describedby", this.id)
          }
          if (!ids.split(/\s+/).includes(this.id)) {
            this.anchor?.setAttribute("aria-describedby", ids + " " + this.id)
          }
        }
      } else {
        // Make sure to clean these up.
        rootNode.removeEventListener("pointermove", this.eventHandler.get(this.handleHide))
        document.removeEventListener("pointermove", this.eventHandler.get(this.handleHide))
      }
    }

    super.willUpdate(changedProperties)
  }

  /**
   * @param {Event} event
   * @returns {void}
   */
  handleHide (event) {
    const composedPath = event.composedPath()
    if (
      composedPath.includes(this) ||
      (this.anchor instanceof HTMLElement && composedPath.includes(this.anchor))
    ) {
      return
    }

    /**
     * @type {RoleTooltip["__triggerSource"]}
     */
    let triggerSource = event.type.startsWith("pointer") ? "hover" : "focus"

    this.hide(triggerSource)
  }

  /**
   * @param {null | RoleTooltip["__triggerSource"]} [triggerSource]
   * @returns {void}
   */
  hide (triggerSource) {
    if (!triggerSource) { triggerSource = null }

    // We don't want to hide the tooltip if it was triggered by focus. But we will hide it if you focus -> click.
    if (this.active && this.__triggerSource === "focus" && triggerSource === "hover") {
      return
    }

    /**
     * Reset the trigger source before we start to hide everything.
     */
    this.__triggerSource = null

    this.active = false
  };
}
