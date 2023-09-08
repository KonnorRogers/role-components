// @ts-check

import { BaseElement } from "../base-element.js";
import { css, html } from "lit"

/**
 * A toolbar following the W3C Toolbar pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 * @customElement
 */
export default class RoleToolbar extends BaseElement {
  static properties = {
    orientation: { reflect: true },
    _currentFocusIndex: {state: true},
    _toolbarItems: {state: true}
  }

  constructor () {
    super()

    /**
     * @type {number}
     */
    this._currentFocusIndex = 0


    /**
     * @type {"vertical" | "horizontal"}
     */
    this.orientation = "horizontal"

    /** @type Array<Element> */
    this._toolbarItems = []

    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);

    // Handles nested slot issues focusing the toolbar itself.
    this.addEventListener("focus", this.handleClick);
  }

  /**
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate (changedProperties) {
    if (changedProperties.has("_toolbarItems")) {
      this.updateToolbarItems()
    }
    super.willUpdate(changedProperties)
  }

  /** @returns {string} */
  static get baseName() {
    return "role-toolbar";
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .base {
        display: flex;
        max-width: 100%;
        padding: 0.4rem 0.6rem;
        border-radius: 4px;
        border: 2px solid transparent;
        gap: 4px;
        overflow: auto;
      }

      :host([orientation="vertical"]) .base {
        flex-direction: column;
      }

      :host(:focus-within) .base {
        border-color: #005a9c;
      }
    `;
  }

  /**
   * @return {Record<string, (event: Event) => void>}
   */
  get keydownHandlers() {
    if (this._keydownHandlers) return this._keydownHandlers;

    this._keydownHandlers = {
      arrowleft: this.focusPrevious,
      arrowup: this.focusPrevious,
      arrowright: this.focusNext,
      arrowdown: this.focusNext,
      home: this.focusFirst,
      end: this.focusLast,
    };

    return this._keydownHandlers;
  }

  render() {
    return html`
      <div role="toolbar" class="base" part="base">
        <slot @slotchange=${this.updateToolbarItems}></slot>
      </div>
    `;
  }

  /** @param {Event} event */
  handleClick = (event) => {

    const focusedElement = event.composedPath().find((el) => {
      // @ts-expect-error
      const role = el?.getAttribute?.('data-role') || ""
      return role.includes('toolbar-item')
    });

    if (focusedElement) {
      this._toolbarItems.forEach((el, index) => {
        if (el === focusedElement) {
          this._currentFocusIndex = index;
          return;
        }
        el.setAttribute("tabindex", "-1");
      });

      // Let the browser decided where focus ends up.
      this.setTabIndex({ focus: false });
    } else {
      // focus the toolbar itself if no focused element clicked.
      this.setTabIndex({ focus: true });
    }
  };

  /** @param {KeyboardEvent} event */
  handleKeyDown = (event) => {
    const key = event.key?.toLowerCase();

    if (
      this.orientation === "vertical" &&
      (key === "arrowleft" || key === "arrowright")
    )
      return;
    if (
      this.orientation === "horizontal" &&
      (key === "arrowdown" || key === "arrowup")
    )
      return;

    if (Object.keys(this.keydownHandlers).includes(key)) {
      event.preventDefault();
      this.keydownHandlers[key](event);
    }
  };

  /** @param {Event} _event */
  focusNext = (_event) => {
    this.currentFocusElement?.setAttribute("tabindex", "-1");
    this._currentFocusIndex += 1;

    if (this._currentFocusIndex >= this._toolbarItems.length) {
      this.focusFirst();
      return;
    }

    this.setTabIndex();
  };

  /** @param {Event} _event */
  focusPrevious = (_event) => {
    this.currentFocusElement?.setAttribute("tabindex", "-1");
    this._currentFocusIndex -= 1;

    if (this._currentFocusIndex < 0) {
      this.focusLast();
      return;
    }

    this.setTabIndex();
  };

  focusFirst = () => {
    this._currentFocusIndex = 0;
    this.setTabIndex();
  };

  focusLast = () => {
    if (this._toolbarItems == null) return

    this._currentFocusIndex = this._toolbarItems.length - 1;
    this.setTabIndex();
  };


  setTabIndex = ({ focus = true } = {}) => {
    this.currentFocusElement?.setAttribute("tabindex", "0");

    if (focus) {
      // @ts-expect-error
      this.currentFocusElement?.focus?.();
    }
  };

  get currentFocusElement() {
    if (this._toolbarItems == null) return

    return this._toolbarItems[this._currentFocusIndex];
  }

  /**
   * @param {undefined | null | Event} [evt] - triggered by a slot change event.
   */
  updateToolbarItems = (evt) => {
    /**
     * @type {HTMLSlotElement}
     */
    // @ts-expect-error
    const slot = evt?.target || this.shadowRoot.querySelector("slot")

    if (slot == null) return

    /** @type {Element[]} */
    const items = slot
      .assignedElements({ flatten: true })
      .filter((el) => {
        return el instanceof HTMLElement && el.dataset.role?.match(/toolbar-item/);
      });
    this._toolbarItems = items
    this._currentFocusIndex = this._toolbarItems.findIndex(
      (el) => el.getAttribute("tabindex") === "0"
    );

    this._toolbarItems.forEach((el) => {
      if (this._toolbarItems[this._currentFocusIndex] === el) return
      el.setAttribute("tabindex", "-1")
    })

    if (this._currentFocusIndex === -1) {
      this._currentFocusIndex = 0;
      this.currentFocusElement?.setAttribute("tabindex", "0");
    }
  };
}
