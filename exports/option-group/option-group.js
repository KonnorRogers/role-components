import { css,html } from "lit";
import { BaseElement } from "../base-element.js";
import { hostStyles } from "../styles/host-styles.js";

export default class OptionGroup extends BaseElement {
  static baseName = "role-option-group"

  static properties = {
    role: { reflect: true }
  }

  static styles = [
    hostStyles,
    css``
  ]

  constructor () {
    super()
    this.role = "group"
  }

  /**
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate (changedProperties) {
    if (changedProperties.has("role")) {
      this.role = "group"
    }

    super.willUpdate(changedProperties)
  }

  render () {
    return html`
      <div part="base">
        <div part="label">
          <slot name="label"></slot>
        </div>
        <slot></slot>
      </div>
    `

  }
}
