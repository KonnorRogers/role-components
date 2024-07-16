import { html } from "lit"

import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { componentStyles } from "./menu-dropdown.styles.js";

import {
  AnchoredRegionProperties,
  AnchoredRegionMixin,
} from "../anchored-region/anchored-region.js"

/**
 * @customElement
 * @tagname role-menu-dropdown
 * @summary Short summary of the component's intended use.
 * @documentation https://role-components.vercel.app/components/menu-dropdown
 * @status experimental
 * @since 3.0
 *
 * @event role-event-name - Emitted as an example.
 *
 * @slot - The default slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class RoleMenuDropdown extends AnchoredRegionMixin(BaseElement) {
  static baseName = "role-menu-dropdown"
  static styles = [
    hostStyles,
    componentStyles,
  ]

  static properties = /** @type {const} */ ({
    ...(AnchoredRegionProperties()),
    slot: { reflect: true },
  })

  constructor () {
    super()

    this.anchoredPopoverType = /** @type {"manual"} */ ("manual")

    /**
     * @override
     * @type {InstanceType<ReturnType<typeof AnchoredRegionMixin<typeof BaseElement>>>["placement"]}
     */
    this.placement = "bottom-end"

    this.distance = 2

    this.anchor = this
  }

  get isSubmenu () {
    return this.slot === "submenu-trigger"
  }

  /**
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate (changedProperties) {
    this.placement = this.isSubmenu ? "right-start" : "bottom-end"
    // @ts-expect-error
    this.anchor = this.isSubmenu ? this.parentElement : this

    this.distance = this.isSubmenu ? -4 : 2
    this.skidding = this.isSubmenu ? -2 : 0

    super.willUpdate(changedProperties)
  }

  handleActiveChanged () {
    setTimeout(() => {
      const menu = /** @type {import("../menu/menu.js").default | undefined} */ (this.querySelector("role-menu"))

      if (menu) {
        menu.focus()
      }
    }, 100)
  }

  /**
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  updated (changedProperties) {
    if (changedProperties.has("active")) {
      this.handleActiveChanged()
    }
    super.updated(changedProperties)
  }

  render () {
    return html`
        <button
          @click=${(e) => {
            this.active = !this.active
          }}
          aria-expanded=${this.active}
          aria-haspopup="menu"
          tabindex=${this.slot === "submenu-trigger" ? -1 : 0}
          style="
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, auto);
            align-items: center;
          "
        >
          <slot name="trigger">
            ${this.slot === "submenu-trigger"
              ? html`&#xF285; <!-- chevron-right -->`
              : html`&#xF282; <!-- chevron-down -->`
            }
          </slot>
        </button>
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
    `
  }
}
