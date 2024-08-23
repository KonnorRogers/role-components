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
    role: { reflect: true },
    submenuActive: {state: true},
  })

  constructor () {
    super()

    this.internals.role = "menuitem"
    this.role = "menuitem"
    this.tabIndex = 0
    this.submenuActive = false
    this.addEventListener("pointerover", this.eventHandler.get(this.handlePointerOver))
    this.addEventListener("pointerleave", this.eventHandler.get(this.handlePointerLeave))
  }

  /**
   * @param {Event} e
   */
  handlePointerLeave (e) {
    const submenu = this.submenu
    if (submenu && submenu.active) {
      this.submenuActive = false
      submenu.active = false
    }
  }

  /**
   * @param {Event} e
   */
  handlePointerOver (e) {
    e.stopPropagation()
    const parentMenu = this.parentMenu
    if (parentMenu) {
      parentMenu.focusMenuItem(this)
    }
    const submenu = this.submenu
    if (submenu && !submenu.active) {
      submenu.active = true
      this.submenuActive = true
    }
  }

  /**
   * @returns {null | import("../menu/menu.js").default}
   */
  get parentMenu () {
    return this.closest("role-menu")
  }

  /**
   * @returns {null | import("../menu/menu.js").default}
   */
  get submenu () {
    return this.querySelector(":scope > [slot='submenu']")
  }

  get hasSubmenu () {
    return Boolean(this.submenu)
  }

  /**
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  updated (changedProperties) {
    if (changedProperties.has("submenuActive")) {
      if (this.hasSubmenu) {
        this.setAttribute("aria-expanded", this.submenuActive.toString())
        this.setAttribute("aria-expanded", this.submenuActive.toString())
      } else {
        this.removeAttribute("aria-expanded")
      }
    }
    return super.updated(changedProperties)
  }

  render () {
    return html`
      <div style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, auto); gap: 8px;">
        <slot><div></div></slot>
        <slot name="submenu"></slot>
      </div>
    `
  }
}
