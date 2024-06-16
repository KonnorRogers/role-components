import { html } from "lit"

import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { componentStyles } from "./tab-panel.styles.js";

/**
 * @customElement
 * @tagName role-tab-panel
 * @summary Short summary of the component's intended use.
 * @documentation https://role-components.vercel.app/components/tab-panel
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
export default class RoleTabPanel extends BaseElement {
  static baseName = "role-tab-panel"
  static styles = [
    hostStyles,
    componentStyles,
  ]

  static properties = /** @type {const} */ ({

  })

  render () {
    return html`
      <slot></slot>
    `
  }
}
