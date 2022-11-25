import { BaseElement, html, css } from "../base";

/** @extends import("../base-element").BaseElement */
export class RoleToolbar extends BaseElement {
  /** @returns {string} */
  static get baseName() {
    return "role-toolbar";
  }

  /** @returns {string} */
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
   * @return {Record<string, EventHandler>}
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

  /** @returns {string} */
  render() {
    return html`<div role="toolbar" class="base" part="base">
      <slot></slot>
    </div>`;
  }

  /** @returns {void} */
  connectedCallback() {
    super.connectedCallback();

    this.shadowRoot
      .querySelector("slot:not([name])")
      .addEventListener("slotchange", this.updateToolbarItems);
    this.updateToolbarItems();

    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);

    // Handles nested slot issues focusing the toolbar itself.
    this.addEventListener("focus", this.handleClick);
  }

  handleClick = (event) => {
    const target = event.composedPath?.()[0] || event.target;
    const focusedElement = target.closest(`[data-role='toolbar-item']`);

    if (focusedElement) {
      this.toolbarItems.forEach((el, index) => {
        if (el === focusedElement) {
          this.currentFocusIndex = index;
          return;
        }
        el.setAttribute("tabindex", "-1");
      });
    }

    this.focusCurrentElement();
  };

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
      this.keydownHandlers[key]();
    }
  };

  get orientation() {
    return this.getAttribute("orientation") === "vertical"
      ? "vertical"
      : "horizontal";
  }

  focusNext = (_event) => {
    this.currentFocusElement.setAttribute("tabindex", "-1");
    this.currentFocusIndex += 1;

    if (this.currentFocusIndex >= this.toolbarItems.length) {
      this.focusFirst();
      return;
    }

    this.focusCurrentElement();
  };

  focusPrevious = (_event) => {
    this.currentFocusElement.setAttribute("tabindex", "-1");
    this.currentFocusIndex -= 1;

    if (this.currentFocusIndex < 0) {
      this.focusLast();
      return;
    }

    this.focusCurrentElement();
  };

  focusFirst = () => {
    this.currentFocusIndex = 0;
    this.focusCurrentElement();
  };

  focusLast = () => {
    this.currentFocusIndex = this.toolbarItems.length - 1;
    this.focusCurrentElement();
  };

  focusCurrentElement = () => {
    this.currentFocusElement.setAttribute("tabindex", "0");
    this.currentFocusElement?.focus();
  };

  get currentFocusElement() {
    return this.toolbarItems[this.currentFocusIndex];
  }

  updateToolbarItems = () => {
    this.toolbarItems = this.shadowQuery("slot")
      .assignedElements({ flatten: true })
      .filter((el) => {
        return el.dataset.role?.match(/toolbar-item/);
      });
    this.currentFocusIndex = this.toolbarItems.findIndex(
      (el) => el.getAttribute("tabindex") === "0"
    );

    if (this.currentFocusIndex === -1) {
      this.currentFocusIndex = 0;
      this.currentFocusElement.setAttribute("tabindex", "0");
    }
  };

  /** @returns {void} */
  disconnectedCallback() {}

  /** @returns {void} */
  adoptedCallback() {}
}
