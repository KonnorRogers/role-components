import { html } from "lit"

import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { componentStyles } from "./menu.styles.js";

/**
 * @customElement
 * @tagname role-menu
 * @summary Short summary of the component's intended use.
 * @documentation https://role-components.vercel.app/components/menu
 * @status experimental
 * @since 3.0
 *
 * @event role-event-name - Emitted as an example.
 *
 * @slot - The default slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class RoleMenu extends BaseElement {
  static baseName = "role-menu"
  static styles = [
    hostStyles,
    componentStyles,
  ]

  static properties = /** @type {const} */ ({
  })

  constructor () {
    super()
    this.role = "menu"
    this.internals.role = "menu"
    this.addEventListener("keydown", this.handleKeydown)
  }

  get menuItems () {
    return /** @type {import("../menu-item/menu-item.js").default[]} */ ([...this.querySelectorAll(":scope role-menu-item")]).filter((el) => {
      return el.closest("role-menu") === this
    })
  }

  /**
   * @param {KeyboardEvent} e
   */
  handleKeydown = (e) => {
    const keys = [
      "ArrowDown",
      "ArrowUp",
      "ArrowRight",
      "ArrowLeft"
    ]

    if (!keys.includes(e.key)) {
      return
    }

    const menuItems = this.menuItems

    if (!menuItems.length) { return }

    let currentMenuItemIndex = menuItems.findIndex((el) => el.tabIndex === 0)

    if (currentMenuItemIndex === -1) {
      currentMenuItemIndex = 0
      menuItems[0].tabIndex = 0

      menuItems.forEach((el, index) => {
        if (index === 0) { return }
        el.tabIndex = -1
      })

      menuItems[0].focus()
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      e.stopImmediatePropagation()
      currentMenuItemIndex++

      if (currentMenuItemIndex >= menuItems.length - 1) {
        currentMenuItemIndex = menuItems.length - 1
      }

      menuItems[currentMenuItemIndex].tabIndex = 0

      menuItems.forEach((el, index) => {
        if (index === currentMenuItemIndex) { return }
        el.tabIndex = -1
      })

      menuItems[currentMenuItemIndex].focus()
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      e.stopImmediatePropagation()
      currentMenuItemIndex--;
      if (currentMenuItemIndex <= 0) {
        currentMenuItemIndex = 0
      }
      console.log(currentMenuItemIndex)
      menuItems[currentMenuItemIndex].tabIndex = 0
      menuItems.forEach((el, index) => {
        if (index === currentMenuItemIndex) { return }
        el.tabIndex = -1
      })
      menuItems[currentMenuItemIndex].focus()
      return
    }

    if (e.key === "ArrowRight") {
      const submenu = /** @type {import("../menu/menu.js").default | undefined} */ (menuItems[currentMenuItemIndex].querySelector("role-menu"))

      if (submenu) {
        const submenuDropdown = /** @type {import("../menu-dropdown/menu-dropdown.js").default | undefined} */ (submenu.closest("role-menu-dropdown"))
        e.preventDefault()
        e.stopImmediatePropagation()

        if (submenuDropdown) {
          submenuDropdown.active = true
        }

        setTimeout(() => {
          submenu.focus()
        })
      }
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault()
      e.stopImmediatePropagation()
      const parentMenuItem = /** @type {import("../menu-item/menu-item.js").default} */ (this.closest("role-menu-item"))

      const dropdown = /** @type {import("../menu-dropdown/menu-dropdown.js").default | undefined} */ (this.closest("role-menu-dropdown"))

      if (dropdown) {
        dropdown.active = false
      }

      if (parentMenuItem) {
        parentMenuItem.focus()
      }
    }
  }

  focus () {
    const menuItems = this.menuItems

    if (!menuItems.length) { return }

    let currentMenuItemIndex = menuItems.findIndex((el) => el.tabIndex === 0)

    if (currentMenuItemIndex <= 0) {
      currentMenuItemIndex = 0
    }

    menuItems[currentMenuItemIndex].focus()
  }

  render () {
    return html`<slot></slot>`
  }
}
