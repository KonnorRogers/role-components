import { html } from "lit"

import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { componentStyles } from "./menu.styles.js";

/**
 * @customElement
 * @tagname role-menu
 * @summary Short summary of the component's intended use.
 * @documentation https://role-components.vercel.app/components/menu
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
export default class RoleMenu extends BaseElement {
  static baseName = "role-menu"
  static styles = [
    hostStyles,
    componentStyles,
  ]

  static properties = /** @type {const} */ ({
  })

  constructor () {
    super()
    this.role = "menu"
    this.internals.role = "menu"
  }

  render () {
    return html`
      <slot></slot>
    `
  }
}
