import { html } from "lit"

import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { componentStyles } from "./tab-panel.styles.js";
import { uuidv4 } from "../../../internal/uuid.js";

/**
 * @customelement
 * @tagname role-tab-panel
 * @summary Short summary of the component's intended use.
 * @documentation https://role-components.vercel.app/components/tab-panel
 * @status experimental
 * @since 3.0
 *
 * @slot - The default slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class RoleTabPanel extends BaseElement {
  static baseName = "role-tab-panel"
  static styles = [
    hostStyles,
    componentStyles,
  ]

  static properties = /** @type {const} */ ({
    active: { type: Boolean, reflect: true }
  })

  constructor () {
    super()

    this.internals.role = "tabpanel"
    this.setAttribute("role", "tabpanel")

    /**
     * Whether or not the panel is currently showing.
     * @type {boolean}
     */
    this.active = false

  }

  connectedCallback () {
    super.connectedCallback()
    this.getOrAssignId("role-tab-panel")
  }

  /**
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  updated (changedProperties) {
    if (changedProperties.has("active")) {
      this.internals.ariaSelected = this.active.toString()
      this.setAttribute("aria-selected", this.active.toString())
      this.tabIndex = this.active ? 0 : -1
    }
  }

  render () {
    return html`
      <slot></slot>
    `
  }
}
