import { html } from "lit"

import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { componentStyles } from "./tab.styles.js";

/**
 * @customelement
 * @tagname role-tab
 * @summary Short summary of the component's intended use.
 * @documentation https://role-components.vercel.app/components/tab
 * @status experimental
 * @since 2.0
 *
 * @event role-event-name - Emitted as an example.
 *
 * @slot - The default slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class RoleTab extends BaseElement {
  static baseName = "role-tab"

  static styles = [
    hostStyles,
    componentStyles,
  ]

  static properties = /** @type {const} */ ({
    active: { type: Boolean, reflect: true },
    variant: {reflect: true}
  })

  constructor () {
    super()

    this.tabIndex = -1

    this.internals.role = "tab"
    this.setAttribute("role", "tab")

    /**
     * The "default" variant looks like a button.
     * @type {null | "bordered" | "lifted" | "boxed"}
     */
    this.variant = null

    /**
     * Whether or not the tab is currently having it's associated tab panel shown.
     */
    this.active = false

    /** Tabs are basically buttons. So space / enter should behave like a button. */
    this.addEventListener("keydown", this.eventHandler.get(this.handleKeyDown))
  }

  /**
   * @param {KeyboardEvent} e
   */
  handleKeyDown (e) {
    const handledKeys = ["Enter", " "]

    if (!handledKeys.includes(e.key)) { return }

    e.preventDefault()
    this.click()
  }

  connectedCallback () {
    super.connectedCallback()
    this.getOrAssignId("role-tab")
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
