import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { componentStyles } from "./tab-list.styles.js";
import { html } from "lit"

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://role-components.vercel.app/components/tab-list
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
export default class RoleTabList extends BaseElement {
  static styles = [
    hostStyles,
    componentStyles,
  ]

  static properties = /** @type {const} */ ({
    activeTab: {reflect: true, attribute: "active-tab"},
    role: { reflect: true },
  })

  constructor () {
    super()

    /**
     * The id of the currently active tab.
     * @type {string | null}
     */
    this.activeTab = null

    /**
     * The role of the host. Generally "tablist"
     * @type {string}
     */
    this.role = "tablist"
  }

  render () {
    return html`
      <slot></slot>
    `
  }
}
