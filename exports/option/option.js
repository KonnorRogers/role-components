// @ts-check

import { BaseElement } from "../base-element.js";
import { css, html } from "lit";
import { hostStyles } from "../styles/host-styles.js";
import { stringMap } from "../../internal/string-map.js";
import { LitFormAssociatedMixin } from "form-associated-helpers/exports/mixins/lit-form-associated-mixin.js";

/**
 * @customElement
 * @tagname role-option
 */
export default class RoleOption extends LitFormAssociatedMixin(BaseElement) {
  static baseName = "role-option";

  static properties = {
    ...LitFormAssociatedMixin.formProperties,
    selected: { reflect: true, type: Boolean },
    current: { reflect: true, type: Boolean },
    ariaCurrent: { reflect: true, attribute: "aria-current" },
    ariaSelected: { reflect: true, attribute: "aria-selected" },
    tabIndex: { reflect: true, attribute: "tabindex" }
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
    this.internals.role = "option"

    this.tabIndex = "-1"

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
    if (changedProperties.has("selected")) {
      this.ariaSelected = this.selected.toString()

      if (this.selected) {
        const closestListbox = this.closest("[role='listbox']")
        this.name = closestListbox?.getAttribute("name") || ""
      } else {
        // Set name to empty if its not selected.
        this.name = ""
      }
    }

    if (changedProperties.has("current")) {
      this.ariaCurrent = this.current.toString()
    }

    super.willUpdate(changedProperties);
  }

  render() {
    return html`
      <div
        part=${stringMap({
          base: true,
          "base--selected": this.selected,
          "base--active": this.current,
        })}
      >
        <slot name="checkmark" ?invisible=${!this.selected}> ✓ </slot>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }
}
