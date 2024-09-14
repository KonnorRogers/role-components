import { html } from "lit"

import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { componentStyles } from "./menu.styles.js";
import chevronRight from "../../icons/chevron-right.js";
import chevronDown from "../../icons/chevron-down.js";
import { AnchoredRegionMixin, AnchoredRegionProperties } from "../anchored-region/anchored-region.js";
import chevronLeft from "../../icons/chevron-left.js";

/**
 * @customElement
 * @tagname role-menu
 * @summary Short summary of the component's intended use.
 * @documentation https://role-components.vercel.app/components/menu
 * @status experimental
 * @since 3.0
 *
 * @slot - The default slot.
 * @slot trigger - the text to go within the button
 * @slot trigger-icon - the icon to indicate either the submenu or menu
 *
 * @csspart base - The component's base wrapper.
 * @csspart trigger - the button that triggers the menu or submenu.
 * @csspart anchored-region - The anchored region element
 * @csspart popover - the popover within the anchored region
 * @csspart popover--active - if the popover is active
 * @csspart popover--fixed - if the popover is fixed
 * @csspart popover--has-arrow - if the popover has an arrow
 * @csspart arrow - the arrow element
 * @csspart hover-bridge - the hover bridge element
 * @csspart hover-bridge--visible - if the hover bridge is visible
 *
 * @event {RoleMenuItemSelectedEvent} - Fires when a menu item is selected and will close the menu. Called `event.preventDefault()` to stop this behavior.
 */
export default class RoleMenu extends AnchoredRegionMixin(BaseElement) {
  static baseName = "role-menu"
  static styles = [
    hostStyles,
    componentStyles,
  ]

  static properties = /** @type {const} */ ({
    ...AnchoredRegionProperties(),
    slot: { reflect: true },
    textDirection: { reflect: true, attribute: "text-direction" },
  })

  constructor () {
    super()

    this.anchoredPopoverType = /** @type {"manual"} */ ("manual")
    this.textDirection = "ltr"

    /**
     * @override
     * @type {InstanceType<ReturnType<typeof AnchoredRegionMixin<typeof BaseElement>>>["placement"]}
     */
    this.placement = "bottom-end"

    this.distance = 2

    this.anchor = this
    this.hoverBridge = true

    this.addEventListener("keydown", this.eventHandler.get(this.handleKeydown))
    this.addEventListener("role-menu-item-selected", this.eventHandler.get(this.handleMenuItemSelected))
  }

  connectedCallback () {
    super.connectedCallback()
    document.addEventListener("click", this.eventHandler.get(this.handleOutsideClick))
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    document.removeEventListener("click", this.eventHandler.get(this.handleOutsideClick))
  }

  /**
   * @param {import("../../events/role-menu-item-selected-event.js").RoleMenuItemSelectedEvent} e
   */
  handleMenuItemSelected (e) {
    if (!e.defaultPrevented) {
      this.active = false
    }
  }

  /**
   * @param {Event} e
   */
  handleOutsideClick (e) {
    const path = e.composedPath()

    if (!path.includes(this)) {
      this.active = false
    }
  }

  get menuItems () {
    return /** @type {import("../menu-item/menu-item.js").default[]} */ ([...this.querySelectorAll("[role='menuitem']")])
      .filter((el) => {
        return el.closest(this.localName) === this
      })
  }

  /**
   * @param {KeyboardEvent} e
   */
  handleKeydown (e) {
    if (e.key === "Escape" || e.key === "Tab") {
      this.active = false
      return
    }

    const keys = [
      "ArrowDown",
      "ArrowUp",
      "ArrowRight",
      "ArrowLeft"
    ]

    if (e.ctrlKey || e.altKey || e.shiftKey) { return }

    if (!keys.includes(e.key)) {
      return
    }

    const menu = e.composedPath().find((el) => el.localName === this.localName)

    if (menu !== this) {
      return
    }

    let currentMenuItemIndex = this.currentMenuItemIndex

    if (e.key === "ArrowDown") {
      e.preventDefault()

      if (!this.active) {
        this.active = true
      } else {
        currentMenuItemIndex++
      }

      setTimeout(() => {
        this.focusAtIndex(currentMenuItemIndex)
      })
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      currentMenuItemIndex--;
      setTimeout(() => {
        this.focusAtIndex(currentMenuItemIndex)
      })
      return
    }


    const OPEN_MENU_KEY = this.textDirection === "rtl" ? "ArrowLeft" : "ArrowRight"

    if (e.key === OPEN_MENU_KEY) {
      const submenu = /** @type {import("../menu/menu.js").default | undefined} */ (this.menuItems[currentMenuItemIndex].querySelector("role-menu"))

      if (submenu) {
        e.preventDefault()

        // Without stopPropagation() VoiceOver tries to focus the window in Safari and gets confused.
        e.stopPropagation()
        e.stopImmediatePropagation()

        if (submenu) {
          submenu.active = true
          submenu.focus()
          setTimeout(() => {
            submenu.focus()
          })
        }
      }
    }

    const CLOSE_MENU_KEY = this.textDirection === "rtl" ? "ArrowRight" : "ArrowLeft"

    if (e.key === CLOSE_MENU_KEY) {
      const parentMenuItem = /** @type {import("../menu-item/menu-item.js").default} */ (this.closest("[role='menuitem']"))

      if (parentMenuItem) {
        e.preventDefault()
        e.stopImmediatePropagation()
        parentMenuItem.tabIndex = 0
        setTimeout(() => {
          parentMenuItem.focus()
          setTimeout(() => {
            this.active = false
          })
        })
      }
    }
  }

  get currentMenuItemIndex () {
    const menuItems = this.menuItems

    return menuItems.findIndex((el) => el.tabIndex === 0)
  }

  /**
   * @param {number} index
   */
  focusAtIndex (index) {
    const menuItems = this.menuItems
    if (!menuItems.length) { return }

    if (index < 0) { index = 0 }
    if (index > menuItems.length - 1) { index = menuItems.length - 1 }

    menuItems[index].tabIndex = 0

    menuItems.forEach((el, idx) => {
      if (index === idx) { return }
      el.tabIndex = -1
    })

    if (!menuItems[index].matches(":focus")) {
      menuItems[index].focus()
    }
  }

  focus () {
    this.focusAtIndex(this.currentMenuItemIndex)
  }

  /**
   * @param {import("../menu-item/menu-item.js").default} menuItem
   */
  focusMenuItem (menuItem) {
    const menuItems = this.menuItems

    const index = menuItems.findIndex((el) => el === menuItem)
    this.focusAtIndex(index)
  }

  get isSubmenu () {
    return this.slot === "submenu"
  }

  /**
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate (changedProperties) {
    const submenuPlacement = this.textDirection === "rtl" ? "left-start" : "right-start"
    this.placement = this.isSubmenu ? submenuPlacement : "bottom-end"
    this.anchor = this.isSubmenu ? (this.shadowRoot?.querySelector("button") || this) : this

    this.distance = this.isSubmenu ? 8 : 2
    this.skidding = this.isSubmenu ? 4 : 0


    return super.willUpdate(changedProperties)
  }

  render () {
    const submenuChevron = () => this.textDirection === "rtl" ? chevronLeft : chevronRight
    return html`

      <button
        @click=${(e) => {
          this.active = !this.active
        }}
        aria-expanded=${this.isSubmenu ? null : this.active}
        aria-haspopup=${this.isSubmenu ? null : "menu"}
        tabindex=${this.isSubmenu ? -1 : 0}
        part="trigger"
      >
        <slot name="trigger"><div></div></slot>
        <slot name="trigger-icon">
          ${this.slot === "submenu"
            ? submenuChevron()
            : chevronDown
          }
        </slot>
      </button>
      <role-anchored-region
        part="anchored-region"
        exportparts="
          popover,
          popover--active,
          popover--fixed,
          popover--has-arrow,
          arrow,
          hover-bridge,
          hover-bridge--visible
        "
        .anchor=${this.anchor}
        ?active=${this.active}
        .anchoredPopoverType=${this.anchoredPopoverType}
        .placement=${this.placement}
        .strategy=${this.strategy}
        .distance=${this.distance}
        .skidding=${this.skidding}
        .arrow=${this.arrow}
        .arrowPlacement=${this.arrowPlacement}
        .arrowPadding=${this.arrowPadding}
        .flip=${this.flip}
        .flipFallbackPlacements=${this.flipFallbackPlacements}
        .flipFallbackStrategy=${this.flipFallbackStrategy}
        .flipBoundary=${this.flipBoundary}
        .flipPadding=${this.flipPadding}
        .shift=${this.shift}
        .shiftBoundary=${this.shiftBoundary}
        .shiftPadding=${this.shiftPadding}
        .autoSize=${this.autoSize}
        .sync=${this.sync}
        .autoSizeBoundary=${this.autoSizeBoundary}
        .autoSizePadding=${this.autoSizePadding}
        .hoverBridge=${this.hoverBridge}
        class="${this.active ? '' : 'visually-hidden'}"
        role="none"
      >
        <div role="menu" tabindex="-1"><slot></slot></div>
      </role-anchored-region>
    `
  }
}
