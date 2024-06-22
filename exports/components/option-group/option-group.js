import { css, html } from "lit";
import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";


/**
 * @customelement
 * @tagname role-option-group
 */
export default class OptionGroup extends BaseElement {
  static baseName = "role-option-group";

  static properties = {
    role: { reflect: true },
  };

  static styles = [hostStyles, css`
    [part~="label"] {
      padding: 8px;
      font-weight: bold;
      color: black;
      background-color: rgba(0, 0, 0, 0.05);
      display: block;
    }
  `];

  constructor() {
    super();
    this.role = "group";
    this.setAttribute("role", "group")
    this.setAttribute("tabindex", "-1")
  }

  /**
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has("role")) {
      this.role = "group";
    }

    super.willUpdate(changedProperties);
  }

  render() {
    return html`
      <div part="base">
        <div part="label">
          <slot name="label"></slot>
        </div>
        <slot></slot>
      </div>
    `;
  }
}
