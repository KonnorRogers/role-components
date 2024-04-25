// @ts-check

import { BaseElement } from "../base-element.js";
import { css, html } from "lit";
import { hostStyles } from "../styles/host-styles.js";
import { LitFormAssociatedMixin } from "form-associated-helpers/exports/mixins/lit-form-associated-mixin.js";

/**
 * @customElement
 * @tagname role-option
 */
export default class RoleOption extends LitFormAssociatedMixin(BaseElement) {
  static baseName = "role-option";
  static get validators () { return [] }
  static properties = {
    ...LitFormAssociatedMixin.formProperties,
    defaultSelected: { type: Boolean, attribute: "selected", reflect: true },
    selected: { type: Boolean },
    current: { type: Boolean },
    ariaCurrent: { reflect: true, attribute: "aria-current" },
    ariaSelected: { reflect: true, attribute: "aria-selected" },
    disabled: {type: Boolean},
    label: {},
    tabIndex: {attribute: "tabindex", reflect: true},
    href: {reflect: true},
  };

  formResetCallback () {
    // super.formResetCallback()
    this.selected = this.defaultSelected
  }

  static styles = [
    hostStyles,
    css`
      :host {
        user-select: none;
        cursor: pointer;
      }

      :host(:is(:disabled, [aria-disabled="true"])) {
        cursor: not-allowed;
        background-color: ButtonFace;
        cursor: not-allowed;
        color: GrayText;
      }

      /** use :where() to lower specificity for aria-selected **/
      :host(:where(:hover)) [part~="base"] {
        background-color: ButtonFace;
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
        padding: 0.4em 0.6em;
        align-items: center;
        text-decoration: inherit;
        color: inherit;
      }
    `,
  ];

  constructor() {
    super();

    /**
     * @type {null | string}
     */
    this.href = null

    // Using for passing along all relevant anchor attributes when faking a link click.
    this.linkAttributes = [
      "download",
      "href",
      "hreflang",
      "ping",
      "referrerpolicy",
      "rel",
      "target",
      "type",
    ]

    this.addEventListener("focus", this.eventHandler.get(this.handleFocus))
    this.addEventListener("blur", this.eventHandler.get(this.handleBlur))

    // https://twitter.com/diegohaz/status/1775695123948437646
    this.internals.role = "presentation"

    /**
     * aria-selected is preferred for single-select listboxes / comboboxes
     * @type {boolean}
     */
    this.selected = false;

    /**
     * The selection state when the form is reset
     * @type {boolean}
     */
    this.defaultSelected = this.hasAttribute("selected");

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
    this.value = null

    /**
     * @type {string}
     */
    this.label = this.innerText

    this.tabIndex = -1
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
   * Sends a bubbling focus event to be usable by the combobox.
   */
  handleFocus () {
    this.dispatchEvent(new Event("role-focus", { composed: true, bubbles: true }))
  }

  /**
   * Sends a bubbling focus event to be usable by the combobox.
   */
  handleBlur () {
    this.dispatchEvent(new Event("role-blur", { composed: true, bubbles: true }))
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

    if (changedProperties.has("ariaSelected") || changedProperties.has("selected")) {
      this.setAttribute("aria-selected", this.selected.toString())
    }

    if (changedProperties.has("ariaCurrent") || changedProperties.has("current")) {
      this.setAttribute("aria-current", this.current.toString())
    }

    super.willUpdate(changedProperties);
  }

  simulateLinkClick () {
    if (!this.href) { return }

    const linkEl = document.createElement("a")

    this.linkAttributes.forEach((attr) => {
      const val = this.getAttribute(attr)

      if (val) {
        linkEl.setAttribute(attr, val)
      }
    })

    const parentElement = this.parentElement

    if (!parentElement) { return false }

    parentElement.append(linkEl)
    linkEl.click()
    linkEl.remove()
    return true
  }

  /**
   * @param {ReturnType<import("lit").html>} content
   */
  renderBase (content) {
    if (this.href) {
      // @TODO: Provide a translation mechanism. This is a hacky way to add "link," before announcing the option in screenreaders.
      const roleDescription = html`<span class="visually-hidden">link,</span>`
      return html`${roleDescription}<a
        part="base"
        href=${this.href}
        @click=${(e) => {
          e.preventDefault()
        }}
      >${content}</a>`
    }

    return html`<div part="base">${content}</div>`
  }

  render() {
    return html`
      ${this.renderBase(html`
        <span aria-hidden="true"><slot name="checkmark" ?invisible=${!this.selected}>✓</slot></span>
        <slot @slotchange=${this.handleSlotChange}></slot>
      `)}
    `;
  }
}
