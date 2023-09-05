// @ts-check

import { BaseElement } from "../base-element.js";
import { css, html } from "lit";
import { hostStyles } from "../styles/host-styles.js";
import { stringMap } from "../../internal/string-map.js";

/**
 * @customElement
 */
export default class RoleOption extends BaseElement {
  static baseName = "role-option";

  static properties = {
    selected: { reflect: true, type: Boolean },
    ariaCurrent: { reflect: true, attribute: "aria-current" },
    role: { reflect: true },
    value: {},
  };

  static styles = [
    hostStyles,
    css`
      :host {
        user-select: none;
      }
      /** use :where() to lower specificity for aria-selected **/
      :host(:where(:hover)) [part~="base"] {
        background-color: lightgray;
      }

      [part~="base"] {
        user-select: none;
        cursor: pointer;
        padding: 0.4em 0.6em;
        border: 2px solid transparent;
      }

      :host [part~="base--active"] {
        background-color: lightblue;
      }

      [part~="base"] {
        display: grid;
        grid-template-columns: minmax(0, auto) minmax(0, 1fr);
        align-items: center;
        gap: 4px;
      }
    `,
  ];

  constructor() {
    super();
    this.role = "option";

    /**
     * aria-selected is preferred for single-select listboxes / comboboxes
     * @type {boolean}
     */
    this.selected = false;

    /**
     * @type {boolean}
     */
    this.hasFocus = false;

    /**
     * @type {null | string}
     */
    this.value = null;
  }

  handleSlotChange() {
    if (!this.hasAttribute("value") || this.value == null) {
      this.value = this.innerText;
    }
  }

  /**
   * @override
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has("role")) {
      changedProperties.set("role", "option");
      this.role = "option";
    }

    if (changedProperties.has("selected")) {
      this.setAttribute("aria-selected", this.selected.toString());
    }

    if (changedProperties.has("value")) {
      if (!this.hasAttribute("value") || this.value == null) {
        this.value = this.innerText.split(/\s/).join("_");
      }

      if (this.value.match(/\s/)) {
        console.warn("role-option had white space. Replacing with `_`");
        this.value.split(/ /).join("_");
      }
    }

    super.willUpdate(changedProperties);
  }

  render() {
    return html`
      <div
        part=${stringMap({
          base: true,
          "base--selected": this.selected,
          "base--active": this.ariaCurrent === "true",
        })}
      >
        <slot name="checkmark" ?invisible=${!this.selected}> ✓ </slot>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }
}
