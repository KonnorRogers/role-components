import { html } from "lit"

import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { componentStyles } from "./menu-item.styles.js";
import { RoleMenuItemSelectedEvent } from "../../events/role-menu-item-selected-event.js";

/**
 * @customElement
 * @tagname role-menu-item
 * @summary Short summary of the component's intended use.
 * @documentation https://role-components.vercel.app/components/menu-item
 * @status experimental
 * @since 3.0
 *
 * @slot - The default slot is for the text content.
 * @slot submenu - Slot a `<role-menu>` here and additional menu items.
 *
 * @part base - The base wrapper around the default slot and submenu slot.
 *
 * @event {RoleMenuItemSelectedEvent} role-menu-item-selected - Fires when a menu item is selected and will close the menu. Called `event.preventDefault()` to stop this behavior.
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
    this.addEventListener("click", this.eventHandler.get(this.handleClick))
    this.addEventListener("keydown", this.eventHandler.get(this.handleKeydown))
  }

  handleClick () {
    if (this.hasSubmenu) {
      return
    }

    /**
     * @ignore
     */
    this.dispatchEvent(new RoleMenuItemSelectedEvent(this))
  }

  /**
   * @param {KeyboardEvent} e
   */
  handleKeydown (e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      this.handleClick()
    }
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
      <div part="base">
        <slot><div></div></slot>
        <slot name="submenu"><div></div></slot>
      </div>
    `
  }
}
