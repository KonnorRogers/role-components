import { html } from "lit"

import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { componentStyles } from "./menu-item.styles.js";

/**
 * @customElement
 * @tagname role-menu-item
 * @summary Short summary of the component's intended use.
 * @documentation https://role-components.vercel.app/components/menu-item
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
export default class RoleMenuItem extends BaseElement {
  static baseName = "role-menu-item"
  static styles = [
    hostStyles,
    componentStyles,
  ]

  static properties = /** @type {const} */ ({

  })

  constructor () {
    super()

    this.internals.role = "menuitem"
    this.role = "menuitem"
    this.tabIndex = 0

    this.setAttribute("title", "")

    this.focusMenu = false

    this.addEventListener("focus", () => {
    })
  }

  render () {
    return html`
      <slot></slot>
    `
  }
}
