import { BaseElement } from "../base-element"

/** @extends import("../base-element").BaseElement */
export class RoleToolbar extends BaseElement {
  constructor () {
    super()
  }

  /** @returns {string} */
  static get baseName() {
    return "role-toolbar"
  }

  /** @returns {string} */
  get styles () {
    return `
      :host {
        display: flex;
        padding: 0.4em 0.6em;
        border-radius: 4px;
        border: 2px solid transparent;
        gap: 4px;
      }

      :host([orientation="vertical"]) {
        flex-direction: column;
      }

      :host(:focus-within) {
        border: 2px solid #005a9c;
      }
    `
  }

  /** @returns {string} */
  render () {
    return `<slot></slot>`
  }

  /** @returns {string[]} */
  get observableAttributes () {
    return []
  }

  /** @returns {void} */
  connectedCallback() {
    super.connectedCallback()

    this.setAttribute("role", "toolbar")

    this.addEventListener("slotchange", this.updateToolbarItems)
    this.updateToolbarItems()

    const keys = {
      arrowleft: this.focusPrevious,
      arrowup: this.focusPrevious,
      arrowright: this.focusNext,
      arrowdown: this.focusNext,
      home: this.focusFirst,
      end: this.focusLast
    }

    this.addEventListener("click", (event) => {
      const target = (event.composedPath?.()[0] || event.target)
      const focusedElement = target.closest(`[data-role='toolbar-item']`)

      if (focusedElement) {
        this.toolbarItems.forEach((el, index) => {
          if (el === focusedElement) {
            this.currentFocusIndex = index
            return
          }
          el.setAttribute("tabindex", "-1")
        })
      }

      this.focusCurrentElement()
    })

    this.addEventListener("keydown", (event) => {
      const key = event.key?.toLowerCase()

      if (this.orientation === "vertical" && (key === "arrowleft" || key === "arrowright")) return
      if (this.orientation === "horizontal" && (key === "arrowdown" || key === "arrowup")) return

      if (Object.keys(keys).includes(key)) {
        event.preventDefault()
        keys[key]()
      }
    })
  }

  get orientation () {
    return this.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal"
  }

  focusNext = () => {
    this.currentFocusElement.setAttribute("tabindex", "-1")
    this.currentFocusIndex += 1

    if (this.currentFocusIndex >= this.toolbarItems.length) {
      this.focusFirst()
      return
    }

    this.focusCurrentElement()
  }

  focusPrevious = () => {
    this.currentFocusElement.setAttribute("tabindex", "-1")
    this.currentFocusIndex -= 1

    if (this.currentFocusIndex < 0) {
      this.focusLast()
      return
    }

    this.focusCurrentElement()
  }

  focusFirst = () => {
    this.currentFocusIndex = 0
    this.focusCurrentElement()
  }

  focusLast = () => {
    this.currentFocusIndex = this.toolbarItems.length - 1
    this.focusCurrentElement()
  }

  focusCurrentElement = () => {
    this.currentFocusElement.setAttribute("tabindex", "0")
    this.currentFocusElement?.focus()
  }

  get currentFocusElement () {
    return this.toolbarItems[this.currentFocusIndex]
  }

  updateToolbarItems = () => {
    this.toolbarItems = [...this.querySelectorAll("[data-role~='toolbar-item']")]
    this.currentFocusIndex = this.toolbarItems.findIndex((el) => el.getAttribute("tabindex") === "0")

    if (this.currentFocusIndex === -1) {
      this.currentFocusIndex = 0
      this.currentFocusElement.setAttribute("tabindex", "0")
    }
  }

  /** @returns {void} */
  disconnectedCallback() {}

  /** @returns {void} */
  adoptedCallback() {}
}
