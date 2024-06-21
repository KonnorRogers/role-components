import { when } from "lit/directives/when.js";
import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { componentStyles } from "./tab-list.styles.js";
import { html } from "lit"
import { TabSelectionChangeEvent } from "../../events/tab-selection-change-event.js";

const verticalOrientations = ["start", "end"]
const reverseTabOrderPlacements = ["end", "bottom"]

/**
 * The `<role-tab-list>` component acts as a "synchronization layer" between Tabs and Tab Panels. It will automatically assign ids and provide the proper `aria-*` attributes for tabs and tab-panels following the APG.
 *
 * @customElement
 * @tagName role-tab-list
 * @documentation https://role-components.vercel.app/components/tab-list
 * @status experimental
 * @since 3.0
 *
 * @slot tab - The slot to put tabs
 * @slot tab-panel - The slot to put tab-panels
 *
 * @csspart tab-container - The wrapper around tabs
 * @csspart tab-panel-container - The wrapper around tab panels
 */
export default class RoleTabList extends BaseElement {
  static baseName = "role-tab-list"

  static styles = [
    hostStyles,
    componentStyles,
  ]

  static properties = /** @type {const} */ ({
    activeTab: {reflect: true, attribute: "active-tab"},
    placement: { reflect: true }
  })

  constructor () {
    super()

    this.setAttribute("role", "tab")
    this.internals.role = "tab"


    /**
     * @type {"top" | "bottom" | "start" | "end"}
     */
    this.placement = "top"
  }

  get tabElements () {
    if (this.shadowRoot == null) { return [] }

    const tabSlot = /** @type {HTMLSlotElement} */ (this.shadowRoot.querySelector("slot[name='tab']"))
    const tabs = /** @type {Array<import("../tab/tab.js").default>} */ (tabSlot.assignedElements({ flatten: true }).filter((el) => el.getAttribute("role") === "tab"))
    return tabs
  }

  get tabPanelElements () {
    if (this.shadowRoot == null) { return [] }
    const tabPanelSlot = /** @type {HTMLSlotElement} */ (this.shadowRoot.querySelector("slot[name='panel']"))

    const tabPanels = /** @type {Array<import("../tab-panel/tab-panel.js").default>} */ (tabPanelSlot.assignedElements({ flatten: true }).filter((el) => el.getAttribute("role") === "tabpanel"))

    return tabPanels
  }

  /**
   * Whether or not the tab elements are currently being focused. useful for keydown handlers.
   */
  get tabsHaveFocus () {
    return Boolean(this.shadowRoot?.querySelector("[part~='tab-container']")?.matches(":focus-within"))
  }

  /**
   * Sets the active tab + tab panel based on index (0-based)
   * @param {number} index
   * @param {boolean} wrap - Whether or not to wrap to first / last tab
   */
  setActiveTabFromIndex (index, wrap = false) {
    const tabElements = this.tabElements
    const tabPanelElements = this.tabPanelElements

    if (tabElements.length !== tabPanelElements.length) {
      console.error(`Expected an even number of tabs to tab panels. Tabs: ${tabElements.length}, TabPanels: ${tabPanelElements.length}`)
      return
    }

    if (wrap) {
      if (index > tabElements.length - 1) {
        index = 0
      }

      if (index < 0) {
        index = tabElements.length - 1
      }
    } else {
      if (index > tabElements.length - 1) {
        index = tabElements.length - 1
      }

      if (index < 0) {
        index = 0
      }
    }

    // if (index === this.activeTabIndex) {
    //   return
    // }

    for (let i = 0; i < tabElements.length; i++) {
      const tabElement = tabElements[i]
      const tabPanelElement = tabPanelElements[i]

      if (i === index) {
        tabElement.active = true
        tabPanelElement.active = true

        if (this.tabsHaveFocus) {
          tabElement.focus({ preventScroll: true })
          tabElement.scrollIntoView({ behavior: "smooth" })
        }

        this.calculateIndicator(tabElement)

        // This is a cheeky way to "force" animations after this initial connection.
        setTimeout(() => {
          this.activeTabIndicator.classList.add("animate")
        })
        this.dispatchEvent(new TabSelectionChangeEvent({
          activeTab: tabElement,
          activeTabPanel: tabPanelElement
        }))
        continue
      }

      tabElement.active = false
      tabPanelElement.active = false
    }
  }

  get activeTabIndex () {
    return this.tabElements.findIndex((el) => el.active === true)
  }

  updateTabsAndPanels () {
    const activeTabIndex = this.activeTabIndex

    // If none set, set it to the first one.
    if (activeTabIndex === -1) {
      this.setActiveTabFromIndex(0)
      return
    }

    setTimeout(() => {
      this.setActiveTabFromIndex(activeTabIndex)
    })
  }

  get activeTabIndicator () {
    return /** @type {HTMLElement} */ (this.shadowRoot?.querySelector("[part~='active-tab-indicator']"))
  }

  /**
   * @param {import("../tab/tab.js").default} tabElement
   */
  calculateIndicator (tabElement) {
    const indicator = this.activeTabIndicator

    if (!indicator) { return }

    const parentOffsetLeft = this.offsetLeft
    const parentOffsetTop = this.offsetTop

    const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = tabElement

    /**
     * @param {number} num
     */
    function round (num) {
      return (Math.round(num * 4) / 4).toFixed(2);
    }

    if (verticalOrientations.includes(this.placement)) {
      indicator.style.maxHeight = `${offsetHeight}px`
      indicator.style.setProperty("--translate-y", `${round(offsetTop - parentOffsetTop)}px`)
      indicator.style.maxWidth = `unset`
      // indicator.style.setProperty("--translate-x", `${offsetLeft}px`)

      if (this.placement === "start") {
        indicator.style.setProperty("--translate-x", `${(offsetLeft - parentOffsetLeft) + offsetWidth}px`)
      } else {
        indicator.style.setProperty("--translate-x", `0px`)
      }
    } else {
      indicator.style.maxHeight = `unset`
      indicator.style.setProperty("--translate-y", `${offsetHeight}px`)
      indicator.style.maxWidth = `${offsetWidth}px`
      indicator.style.setProperty("--translate-x", `${offsetLeft - parentOffsetLeft}px`)
    }
  }

  /**
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  updated (changedProperties) {
    if (changedProperties.has("placement")) {
      this.setAttribute("aria-orientation", verticalOrientations.includes(this.placement) ? "vertical" : "horizontal")
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  handleTabContainerKeyDown (e) {
    const { key } = e

    const activeTabIndex = this.activeTabIndex

    // Vertical
    if (verticalOrientations.includes(this.placement)) {
      if (!(key === "ArrowDown" || key === "ArrowUp")) {
        return
      }

      const incrementor = key === "ArrowDown" ? 1 : -1
      this.setActiveTabFromIndex(activeTabIndex + incrementor, true)

      e.preventDefault()
      return
    }

    // Horizontal orientation
    if (!(key === "ArrowRight" || key === "ArrowLeft")) {
      return
    }

    e.preventDefault()

    if (key === "ArrowRight") {
      const incrementor = this.currentTextDirection === "rtl" ? -1 : 1
      this.setActiveTabFromIndex(activeTabIndex + incrementor, true)
      return
    }

    if (key === "ArrowLeft") {
      const incrementor = this.currentTextDirection === "rtl" ? 1 : -1
      this.setActiveTabFromIndex(activeTabIndex + incrementor, true)
      return
    }
  }

  /**
   * @param {Event} e
   */
  handleTabClick (e) {
    const tab = /** @type {HTMLElement[]} */ (e.composedPath()).find((el) => {
      return (el.role === "tab" || el.getAttribute?.("role") === "tab")
    })

    if (!tab) { return }

    const index = this.tabElements.findIndex((el) => el === tab)

    if (index >= 0) {
      this.setActiveTabFromIndex(index)
    }
  }

  renderTabContainer () {
    return html`
      <div part="tab-container" @keydown=${this.handleTabContainerKeyDown} @click=${this.handleTabClick}>
        <slot name="tab" @slotchange=${this.updateTabsAndPanels}></slot>
        <div part="active-tab-indicator"></div>
      </div>
    `
  }

  renderTabPanelContainer () {
    return html`
      <div part="tab-panel-container">
        <slot name="panel" @slotchange=${this.updateTabsAndPanels}></slot>
      </div>
    `
  }

  render () {
    return html`
      ${when(reverseTabOrderPlacements.includes(this.placement),
        () => html`${this.renderTabPanelContainer()}${this.renderTabContainer()}`,
        () => html`${this.renderTabContainer()}${this.renderTabPanelContainer()}`
      )}
    `
  }
}
