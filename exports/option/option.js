// @ts-check

import { BaseElement } from "../base-element.js";
import { css, html } from "lit";
import { hostStyles } from "../styles/host-styles.js";

/**
 * @customElement
 * @tagname role-option
 */
export default class RoleOption extends BaseElement {
  static baseName = "role-option";

  static properties = {
    role: { reflect: true },
    defaultSelected: { type: Boolean, attribute: "selected", reflect: true },
    selected: { type: Boolean },
    current: { type: Boolean },
    ariaCurrent: { reflect: true, attribute: "aria-current" },
    ariaSelected: { reflect: true, attribute: "aria-selected" },
    label: {},
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
        background-color: ButtonFace;
      }

      [part~="base"] {
        user-select: none;
        cursor: pointer;
        padding: 0.4em 0.6em;
        border: 2px solid transparent;
      }

      :host([aria-current="true"]) [part~="base"] {
        background-color: SelectedItem;
        color: SelectedItemText;
      }

      [part~="base"] {
        display: grid;
        grid-template-columns: minmax(0, auto) minmax(0, 1fr);
        grid-auto-flow: column;
        gap: 8px;
        align-items: center;
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
     * aria-current to show the currently focused option
     * @type {boolean}
     */
    this.current = false;

    /**
     * @type {boolean}
     */
    this.hasFocus = false;

    /**
     * @type {null | string}
     */
    this.value = "";

    /**
     * @type {string}
     */
    this.label = this.innerText

  }

  connectedCallback () {
    super.connectedCallback()

    this.setAttribute("role", "option")
  }

  handleSlotChange() {
    if (!this.hasAttribute("value") || !this.value) {
      this.value = this.innerText;
    }
  }

  /**
   * @override
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate(changedProperties) {

    if (changedProperties.has("label")) {
      if (!this.label) {
        this.label = this.innerText
      }
    }

    if (changedProperties.has("value")) {
      if (this.value == null) {
        this.value = this.innerText
      }
    }

    if (changedProperties.has("selected")) {
      // this.setAttribute("aria-selected", this.selected.toString())
      if (this.selected) {
        this.setAttribute("aria-selected", this.selected.toString())
      } else {
        this.removeAttribute("aria-selected")
      }
    }

    // if (changedProperties.has("current")) {
    //   // this.setAttribute("aria-current", (this.current || "").toString())
    //   if (this.current) {
    //     this.setAttribute("aria-current", "true")
    //   } else {
    //     this.removeAttribute("aria-current")
    //   }
    // }

    super.willUpdate(changedProperties);
  }

  render() {
    return html`
      <div
        part="base"
      >
        <slot name="checkmark" ?invisible=${!this.selected} aria-hidden="true">✓</slot>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }
}
