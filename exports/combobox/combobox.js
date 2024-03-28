// @ts-check

// https://codepen.io/smhigley/pen/JjoKgxb
// https://codepen.io/smhigley/pen/GRgjRVN
// https://codepen.io/smhigley/pen/BayzXbO
// Types:
// Listbox

// Select only vs Editable
// Single select vs multi-select

// Autocomplete types:
// autocomplete="none"
// autocomplete="inline"
// autocomplete="list"
// autocomplete="both"

// "Tag" types
// selection-type="comma-separated | inline-buttons | outside-buttons"

// Filtering
// Filter results
// don't filter (always show all options)


import { BaseElement } from "../base-element.js";
import { css, html, LitElement } from "lit";
import { hostStyles } from "../styles/host-styles.js";
// import { wrap } from "../../internal/wrap.js";
// import { clamp } from "../../internal/clamp.js";
import { uuidv4 } from "../../internal/uuid.js";
// import { SelectedEvent } from "../events/selected-event.js";
// import { isMacOs } from "../../internal/is-mac-os.js";
import { LitFormAssociatedMixin } from "form-associated-helpers/exports/mixins/lit-form-associated-mixin.js";
import { wrap } from "../../internal/wrap.js";
import { clamp } from "../../internal/clamp.js";
import { isMacOs } from "../../internal/is-mac-os.js";
import { SelectedEvent } from "../events/selected-event.js";
import { when } from "lit/directives/when.js";

/**
 * @typedef {import("../option/option.js").default} RoleOption
 */

/**
 * @typedef {{ from: number, to: number }} Range
 */

/**
 * @type {import("form-associated-helpers/exports/mixins/lit-form-associated-mixin.js").LitFormAssociatedMixin["formProperties"]}
 */
const formProperties = LitFormAssociatedMixin.formProperties

/**
 * A listbox following the W3C Listbox pattern.
 *
 * <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
 *
 *
 * `Single-select` listbox uses the "select follows focus" model.
 *
 *
 * `Multi-select` listbox implements the keyboard recommendations here: <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/#keyboard_interaction>
 *
 *   - <kbd>Shift + Down Arrow</kbd>: Moves focus to and toggles the selected state of the next option.
 *   - <kbd>Shift + Up Arrow</kbd>: Moves focus to and toggles the selected state of the previous option.
 *   - <kbd>Shift + Space</kbd>: Selects contiguous items from the most recently selected item to the focused item.
 *   - <kbd>Control + Shift + Home</kbd>: Selects the focused option and all options up to the first option. Optionally, moves focus to the first option.
 *   - <kbd>Control + Shift + End</kbd>: Selects the focused option and all options down to the last option.
 *   - <kbd>Control + a</kbd>: Selects all
 *
 *   The currently hovered / focus `<role-option>` has `[aria-current="true"]`
 *
 *   The currently selected `<role-option>` has `[aria-selected="true"]`
 * @customElement
 * @tagname role-listbox
 */
export default class RoleListbox extends LitFormAssociatedMixin(BaseElement) {
  static baseName = "role-combobox";
  static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true }

  /**
   * @type {HTMLElement["focus"]}
   */
  focus (...args) {
    this.combobox.focus(...args)
  }

  static styles = [
    hostStyles,
    css`

      /** because position: absolute; + isolation: isolate; don't always pierce. */
      [part~='popup']::part(popup) {
        z-index: 1;
      }
    `
  ]

  static properties = {
    ...formProperties,
    expanded: { type: Boolean, reflect: true },
    autocomplete: {},
    multiple: { type: Boolean, reflect: true },
    // selectedOptions: { type: Array, state: true, attribute: false },
    // currentOption: { state: true, attribute: false },
    wrapSelection: {
      attribute: "wrap-selection",
      reflect: true,
      type: Boolean,
    },

    searchBufferDelay: {
      attribute: "search-buffer-delay",
      type: Number,
      reflect: true,
    },

    // Properties
    _hasFocused: { attribute: false, state: true },
    _searchBuffer: { attribute: false, state: true },
    _searchBufferDebounce: { attribute: false, state: true },
    options: { attribute: false, state: true },
    currentOption: { attribute: false, state: true },
    rangeStartOption: { attribute: false, state: true },
    // tabIndex: { reflect: true, attribute: "tabindex", type: Number }
  }

  constructor () {
    super()

    this.listboxId = "role-listbox-" + uuidv4()

    /**
     * @type {'' | "off" | "inline" | "list" | "both"}
     */
    this.autocomplete = ''

    /**
     * @type {(RoleOption | HTMLOptionElement)[]}
     */
    this.selectedOptions = []

    /**
     * @type {(RoleOption | HTMLOptionElement)[]}
     */
    this.options = []

    /**
     * @type {null | RoleOption | HTMLOptionElement}
     */
    this.currentOption = null

    /**
     * @type {boolean}
     */
    this.expanded = false

    /**
     * Whether to allow multiple selections.
     * @type {boolean}
     */
    this.multiple = false

    /**
     * @type {null | FormData | string}
     */
    this.value = null

    /**
     * @type {null | HTMLElement}
     */
    this.rangeStartOption = null

    /**
     * @type {boolean}
     */
    this.wrapSelection = false;

    /**
     * @type {string}
     */
    this.role = "presentation";

    /**
     * @type {string}
     */
    this.label = "";

    /**
     * Internal buffer for searching the listbox.
     * @internal
     * @type {string}
     */
    this._searchBuffer = "";

    /**
     * timeoutId to clear the search buffer
     * @internal
     * @type {null | ReturnType<typeof setTimeout>}
     */
    this._searchBufferDebounce = null;

    /**
     * @internal
     */
    this._editableAutocompletes = ["off", "list", "inline", "both"]

    /**
     * Delay before the search buffer returns to an empty string
     * @type {number}
     */
    this.searchBufferDelay = 600;

    this.attributeFilter = [
      "aria-current",
      "selected",
      "current",
      "aria-selected",
      "role",
    ];

    /**
     * Monitors its DOM for new nodes and assigns them to `this.options`
     * @type {MutationObserver}
     */
    this.optionObserver = new MutationObserver((mutations) => {
      for (const { attributeName } of mutations) {
        if (attributeName == null) continue;

        if (this.attributeFilter.includes(attributeName)) {
          this.debounce(() => this.updateOptions(), {
            wait: 10,
            key: this.updateOptions,
          });
          // this.updateOptions()
        }

        // We really care about the mutations, we just need to know if things are updating.
        break;
      }
    });

    this.addEventListener("keydown", this.eventHandler.get(this.handleKeyDown));
    this.addEventListener("click", this.eventHandler.get(this.handleInputClick));
    this.addEventListener("click", this.eventHandler.get(this.handleOptionClick));
    this.addEventListener("pointermove", this.eventHandler.get(this.handleOptionHover))
    // this.addEventListener("focusin", this.eventHandler.get(this.handleFocusIn));

    this.addEventListener("input", this.eventHandler.get(this.focusElementFromInput))
    this.addEventListener("keydown", this.eventHandler.get((/** @type {KeyboardEvent} */ e) => {
      if (e.key === "Tab") {
        this.expanded = false
      }
    }))
  }

  /**
   * @param {Event} e
   */
  handleInputClick (e) {
    if (e.target.closest("[slot='input']")) {
      this.expanded = !this.expanded
    }
  }


  /**
   * @param {Event} e
   */
  handleOutsideClick (e) {
    const path = e.composedPath()

    if (!path.includes(this)) {
      this.expanded = false
      return
    }
  }

  /**
   * Users dont always provide ids on elements, and we need to make sure the id isn't already taken.
   * @param {HTMLElement} el
   */
  assignRandomId(el, id = uuidv4()) {
    if (!el.hasAttribute("id")) {
      el.setAttribute("id", "role-listbox-option-" + id);
    }
  }

  get clonedOptions () {
    /**
     * @type {HTMLSlotElement | null | undefined}
     */
    const defaultSlot = this.shadowRoot?.querySelector("slot:not([name])")

    if (!defaultSlot) return []

    return defaultSlot.assignedElements({ flatten: true }).map((option) => option.cloneNode(true))
  }

  get listbox () {
    return this.querySelector(":scope > [slot='listbox']")
  }

  get isEditable () {
    return this._editableAutocompletes.includes(this.autocomplete)
  }

  /**
   * Adds proper attributes to the slotted listbox element
   */
  updateListboxElement () {
    const listboxElement = this.querySelector(":scope > [slot='listbox']")

    if (!listboxElement) return

    listboxElement.setAttribute("role", "listbox")
    this.listboxId = listboxElement.id || uuidv4()
  }

  /**
   * Adds proper attributes to the slotted input element
   */
  updateInputElement () {
    const inputElement = this.querySelector(":scope > [slot='input']")
    this.inputElement = inputElement

    if (!inputElement) return

    const attributes = [
      ["role", "combobox"],
      ["aria-haspopup", "listbox"],
      ["aria-controls", this.listboxId],
      ["aria-expanded", "false"],
      ["aria-activedescendant", this.currentOption?.id || ""],
      ["aria-autocomplete", this.autocomplete],
      ["spellcheck", "false"],
    ]

    /**
     * @type {Array<[string, boolean]>}
     */
    const booleanAttributes = [
      ["readonly", !this.isEditable]
    ]

    for (const [attr, value] of attributes) {
      inputElement.setAttribute(attr, value)
    }

    for (const [booleanAttr, bool] of booleanAttributes) {
      inputElement.toggleAttribute(booleanAttr, bool)
    }

    // inputElement.addEventListener("focus", this.eventHandler.get(this.handleInputFocus))

    // <input
    //   part="input"
    //   role="combobox"
    //   aria-haspopup="listbox"
    //   aria-controls="listbox"
    //   aria-expanded=${this.expanded}
    //   aria-activedescendant=${this.currentOption?.id}
    //   aria-autocomplete=${this.autocomplete}
    //   spellcheck="false"
    //   ?readonly=${!this.isEditable}
    //   @input=${this.focusElementFromInput}
    //   @focus=${() => this.expanded = true}
    //   @keydown=${(/** @type {KeyboardEvent} */ e) => {
    //     if (e.key === "Tab") {
    //       this.expanded = false
    //     }
    //   }}
    // >

  }

  render () {
    const finalHTML = html`
      <span id="remove" class="visually-hidden">Remove</span>

      <label part="label" for="input">
        <slot name="label"></slot>
      </label>

      ${when(this.multiple,
        () => html`
          <ul part="selected-options" aria-live="assertive" aria-atomic="false" aria-relevant="additions removals">
            ${this.selectedOptions.map((option) => {
              return html`<li><button type="button" part="button">${option.textContent}<span aria-hidden="true" style="">&times;</span></button></li>`
            })}
          </ul>
        `
      )}

      <sl-popup
        id="popup"
        placement="bottom"
        sync="width"
        ?active=${this.expanded}
        hover-bridge
        distance="6"
        part="popup"
      >
        <div
          slot="anchor"
          style="display: grid; grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto);"
        >
          <slot name="prefix"><div></div></slot>
          <slot name="input" @slotchange=${this.updateInputElement}></slot>
          <slot name="suffix"><div></div></slot>
        </div>

        <div
          part="listbox"
          style="
            background-color: white;
            border: 2px dashed tomato;
          "
        >
          <slot name="listbox" @slotchange=${this.updateListboxElement}></slot>
        </div>
      </sl-popup>
    `

    return finalHTML
  }

  /**
   * @override
   *
   */
  connectedCallback() {
    super.connectedCallback();

    document.addEventListener("click", this.eventHandler.get(this.handleOutsideClick));

    // this.updateOptions()
    this.updateComplete.then(() => {
      this.updateOptions()
    })

    /**
     * We only care about "role" attribute changes
     */
    this.optionObserver.observe(this, {
      subtree: true,
      childList: true,
      attributeFilter: this.attributeFilter,
    });

  }

  disconnectedCallback () {
    super.disconnectedCallback()

    document.removeEventListener("click", this.eventHandler.get(this.handleOutsideClick));
  }

  /**
   * @override
   */
  formResetCallback () {
    super.formResetCallback()

    this.options.forEach((option) => {
      const opt = /** @type {HTMLOptionElement} */ (option)
      opt.selected = opt.defaultSelected ?? opt.hasAttribute("selected")
    })

    this.updateOptions()
  }

  get combobox () {
    return /** @type {HTMLInputElement} */ (this.inputElement)
  }

  /**
   * @override
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate(changedProperties) {
    const combobox = this.combobox

    if (combobox && changedProperties.has("expanded")) {
      combobox.setAttribute("aria-expanded", this.expanded.toString())
    }

    if (combobox && changedProperties.has("multiple")) {
      if (this.multiple === true) {
        combobox.setAttribute("aria-multiselectable", "true");
      } else {
        combobox.removeAttribute("aria-multiselectable");
      }
    }

    if (changedProperties.has("currentOption")) {
      const previousActiveOption = changedProperties.get("currentOption");

      if (this.currentOption !== previousActiveOption) {
        if (previousActiveOption) {
          this.removeFocus(previousActiveOption);
        }
      }
    }

    super.willUpdate(changedProperties);
  }

  /**
   * @param {HTMLElement} option
   */
  setFocus(option) {
    option.setAttribute("aria-current", "true");
    /** @type {import("../option/option.js").default} */ (option).current = true;
  }

  /**
   * @param {HTMLElement} option
   */
  removeFocus(option) {
    option.setAttribute("aria-current", "false");
    /** @type {import("../option/option.js").default} */ (option).current = false;
  }

  /**
   * @param {PointerEvent} evt
   */
  handleOptionClick(evt) {
    const path = evt.composedPath();

    const option = /** @type {HTMLElement | null} */ (
      path.find((el) => {
        return (
          /** @type {HTMLElement} */ (el).getAttribute?.("role") === "option" || el instanceof HTMLOptionElement
        );
      })
    );

    if (!option) return;

    this.currentOption = /** @type {RoleOption} */ (option);

    if (this.multiple) {
      if (evt.shiftKey) {
        this.selectFromRangeStartToCurrent()
      } else {
        this.toggleSelected(option);
      }
    }

    this.focusCurrent();

    if (!this.multiple) {
      this.toggleSelected(this.currentOption)
      this.expanded = false
    }
  }


  /**
   * @param {Event} evt
   */
  handleOptionHover(evt) {
    const path = evt.composedPath();

    const option = /** @type {HTMLElement | null} */ (
      path.find((el) => {
        return (
          /** @type {HTMLElement} */ (el).getAttribute?.("role") === "option" || el instanceof HTMLOptionElement
        );
      })
    );

    if (!option) return;

    this.scrollOptionIntoView(option)
  }

  get currentOptionIndex() {
    return this.options.findIndex((el) => el === this.currentOption);
  }

  /**
   * Reset range when shiftKey goes up
   * @param {KeyboardEvent} evt
   */
  handleKeyUp (evt) {
    if (evt.key === "Shift") {
      this.rangeStartOption = this.currentOption
    }
  }

  /**
   * @param {KeyboardEvent} evt
   */
  handleKeyDown(evt) {
    if (evt.key === "Tab" || evt.key === "Escape") {
      if (evt.key === "Escape") { evt.preventDefault() }
      this.expanded = false
      return
    }

    const ctrlKeyPressed = evt.ctrlKey || (isMacOs() && evt.metaKey);
    const shiftKeyPressed = evt.shiftKey;
    const metaKeyPressed = evt.metaKey;

    const handledKeys = {
      home: "Home",
      end: "End",
      arrowDown: "ArrowDown",
      arrowUp: "ArrowUp",
      space: " ",
    };

    if (evt.key === "Enter") {
      if (this.currentOption) {
        this.toggleSelected(this.currentOption);
      }

      // Close the combobox for single select.
      if (!this.multiple) {
        this.expanded = false
        return
      }
    }

    if (evt.key === "Shift") {
      this.rangeStartOption = this.currentOption
      return
    }

    /**
     * Internal search buffer stuff
     */
    if (
      ctrlKeyPressed === false &&
      metaKeyPressed === false &&
      evt.key.match(/^.$/)
    ) {
      // For editable comboboxes, we don't want to use the internal search buffer. We rely on the actual input element.
      if (this.isEditable) return

      evt.preventDefault();

      if (this.multiple && this._searchBuffer === "" && evt.key === " ") {
        // Mark selected
        if (this.currentOption) {
          this.toggleSelected(this.currentOption);
        }
        return;
      }

      this._searchBuffer += evt.key;

      this.focusElementFromSearchBuffer();

      this.debounce(
        () => {
          this._searchBuffer = "";
        },
        { wait: this.searchBufferDelay, key: this.handleKeyDown },
      );
      return;
    }

    if (this.multiple) {
      // Multi-select has slight different interactions so we need to check different key combos

      if (ctrlKeyPressed && shiftKeyPressed) {
        // CTRL + Shift + Home
        // Select from start -> focus
        if (evt.key === "Home") {
          evt.preventDefault();
          this.selectFromStartToCurrent()
          return;
        }

        // CTRL + Shift + End
        // Select from focus -> end
        if (evt.key === "End") {
          evt.preventDefault();
          this.selectFromCurrentToEnd()
          return;
        }
      }

      // CTRL + a || CTRL + A
      if (ctrlKeyPressed && evt.key.match(/^[aA]$/)) {
        evt.preventDefault();

        if (this.selectedOptions.length === this.options.length) {
          this.deselectAll();
        } else {
          this.selectAll();
        }
        return;
      }

      if (shiftKeyPressed) {
        // Shift + Space. Selects from last selected item to currently focused item
        if (evt.key === "Enter" || evt.key === " ") {
          evt.preventDefault()
          this.selectFromClosestSelectedToCurrent()
          return
        }
        // Shift + DownArrow
        if (evt.key === "ArrowDown") {
          this.focusNext();
          this.selectFromRangeStartToCurrent()
          return;
        }

        // Shift + UpArrow
        if (evt.key === "ArrowUp") {
          this.focusPrevious();
          this.selectFromRangeStartToCurrent()
          return;
        }
      }
    }

    if (Object.values(handledKeys).includes(evt.key)) {
      evt.preventDefault();
    }

    if (evt.key === "Home") {
      this.focusFirst();
      return;
    }

    if (evt.key === "End") {
      this.focusLast();
      return;
    }

    if (evt.key === "ArrowDown") {
      if (this.expanded === false) {
        this.expanded = true
        this.focusCurrent()
        return
      }
      this.focusNext();
      return;
    }

    if (evt.key === "ArrowUp") {
      this.focusPrevious();
      return;
    }
  }

  /**
   * Finds the closest selected option prior to the current option
   */
  selectFromClosestSelectedToCurrent () {
    let currentOptionIndex = this.currentOptionIndex

    let prevSelectedIndex = 0

    for (let i = currentOptionIndex; i >= 0; i--) {
      const curr = this.options[i]

      if (this.isSelected(curr)) {
        prevSelectedIndex = i
        break;
      }
    }


    if (this.multiple) { return }

    /**
     * We don't need to de-select previous items. Just from rangeStart -> currentIndex
     * So lets slice from prev -> current
     */
    this.options.slice(prevSelectedIndex, currentOptionIndex + 1).forEach((opt) => {
      this.select(opt)
    })
  }

  /**
   *
   */
  selectFromRangeStartToCurrent () {
    const rangeStartOption = this.rangeStartOption
    const currentOption = this.currentOption


    if (currentOption == null) return

    const currentOptionIndex = this.currentOptionIndex

    if (rangeStartOption == null) {
      this.selectRange({ from: 0, to: currentOptionIndex })
    }

    if (rangeStartOption === currentOption) {
      this.select(currentOption)
      return
    }


    const rangeStartIndex = this.options.findIndex((el) => {
      return el === rangeStartOption
    })

    if (rangeStartIndex === -1) {
      return
    }

    if (rangeStartIndex > currentOptionIndex) {
      this.selectRange({ from: currentOptionIndex, to: rangeStartIndex })
      return
    }

    this.selectRange({ from: rangeStartIndex, to: currentOptionIndex })
  }

  /**
   * Selects all options in a range and deselects all options not in the range
   * @param {Range} options
   */
  selectRange ({ from, to }) {
    this.options.forEach((opt, index) => {
      if (index >= from && index <= to) {
        this.select(opt)
      } else {
        this.deselect(opt)
      }
    })
  }

  /**
   * @param {number} [startIndex=0]
   */
  selectFromStartToCurrent (startIndex = 0) {
    this.options
      .slice(startIndex, this.currentOptionIndex + 1)
      .forEach((opt) => {
        this.select(opt);
      });
  }

  /**
   * @param {number} [endIndex=this.options.length-1]
   */
  selectFromCurrentToEnd (endIndex = this.options.length - 1) {
    this.options
      .slice(this.currentOptionIndex, endIndex)
      .forEach((opt) => {
        this.select(opt);
      });
  }

  /**
   * @param {Event & { inputType: string }} e
   */
  focusElementFromInput (e) {
    if (e.target !== this.inputElement) return

    // If we don't check this, we end up not being able to delete anything
    if (e.inputType === "deleteContentBackward" && !this.multiple) {
      this.deselectAll()

      // if (this.currentOption) {
      //   this.select(this.currentOption)
      // }
      return
    }


    const combobox = this.combobox

    if (!combobox) return

    const searchValue = combobox.value;

    if (!searchValue) return

    // We dont focus elements if inline or off
    if (this.autocomplete !== "inline" && this.autocomplete !== "list" && this.autocomplete !== "both") return

    if (!this.expanded) {
      this.expanded = true
    }

    const regex = new RegExp("^" + searchValue.replaceAll(/\\/g, "\\\\").toLowerCase())

    const matchedEl = this.options.find((el) => {
      // Native select only matches by case in-equal innerText.
      return el.innerText.toLowerCase().match(regex);
    });

    if (!matchedEl) return

    this.currentOption = /** @type {RoleOption} */ (matchedEl);

    // focusCurrent is going to set the value for us, but we need to track the `currentSize` and then after the
    // value is set, create a selection range.
    if (this.autocomplete === "inline" || this.autocomplete === "both") {
      const currentSize = combobox.value.length

      setTimeout(() => {
        combobox.setSelectionRange(currentSize, combobox.value.length)
      }, 10)
    }

    this.focusCurrent();
    this.select(this.currentOption)
  }

  focusElementFromSearchBuffer() {
    const searchBuffer = this._searchBuffer;

    const regex = new RegExp("^" + searchBuffer.replaceAll(/\\/g, "\\\\").toLowerCase())

    const matchedEl = this.options.find((el) => {
      // Native select only matches by case in-equal innerText.
      return el.innerText.toLowerCase().match(regex);
    });

    if (matchedEl && this.currentOption !== matchedEl) {
      this.currentOption = /** @type {RoleOption} */ (matchedEl);
      this.focusCurrent();
    }
  }

  /**
   * @param {HTMLElement} selectedElement
   */
  select(selectedElement) {
    if (!this.multiple) {
      this.deselectAll()
    }

    this.selectedOptions = this.selectedOptions.concat(/** @type {RoleOption} */ (selectedElement));
    /** @type {HTMLOptionElement} */ (selectedElement).selected = true;

    // We don't want to override normal HTMLOptionElement semantics.
    if (!(selectedElement instanceof HTMLOptionElement)) {
      /** @type {HTMLElement} */ (selectedElement).setAttribute("aria-selected", "true");
    }

    // this.updateOptions()
    this.debounce(() => this.updateOptions(), {
      key: this.updateOptions,
      wait: 0
    })

    const event = new SelectedEvent("role-selected", { selectedElement });
    selectedElement.dispatchEvent(event);

    // @TODO: account for multiple.
    if (this.currentOption) {
      this.combobox.value = this.currentOption.innerText
    }
  }

  /**
   * @param {HTMLElement} selectedElement
   */
  deselect(selectedElement) {
    /** @type {HTMLOptionElement} */ (selectedElement).selected = false;
    selectedElement.removeAttribute("aria-selected");

    const event = new SelectedEvent("role-deselected", { selectedElement });
    selectedElement.dispatchEvent(event);

    // this.debounce(() => this.updateOptions(), {
    //   wait: 0,
    //   key: this.updateOptions,
    // });
  }

  /**
   * Mark every element with [aria-selected="true"]
   */
  selectAll() {
    for (const opt of this.options) {
      this.select(opt);
    }

    this.updateOptions()
  }

  /**
   * Mark every element with [aria-selected="false"]
   */
  deselectAll() {
    for (const opt of this.options) {
      this.deselect(opt);
    }

    this.updateOptions()
  }

  /**
   * @param {HTMLElement} selectedElement
   */
  toggleSelected(selectedElement) {
    if (this.isSelected(selectedElement)) {
      this.deselect(selectedElement);
      return;
    }

    this.select(selectedElement);
  }

  focusCurrent() {
    const selectedElement = this.currentOption;

    if (!selectedElement) {
      this.focusFirst()
      return
    }

    const combobox = this.combobox

    if (!combobox) return

    // Common to both multi + single
    this.combobox.setAttribute(
      "aria-activedescendant",
      selectedElement.getAttribute("id") || "",
    );
    this.setFocus(selectedElement);

    // if (!this.multiple) {
    //   this.deselectAll()
    //   this.select(selectedElement);
    // }

    this.scrollOptionIntoView(selectedElement);
  }

  /**
   * @param {number} index
   */
  focusAt(index) {
    if (this.wrapSelection) {
      index = wrap(0, index, this.options.length - 1);
    } else {
      index = clamp(0, index, this.options.length - 1);
    }

    this.currentOption = /** @type {RoleOption} */ (this.options[index]);
    this.focusCurrent();
  }

  focusNext() {
    this.focusAt(this.currentOptionIndex + 1);
  }

  focusPrevious() {
    this.focusAt(this.currentOptionIndex - 1);
  }

  focusFirst() {
    this.currentOption = this.options[0];
    this.focusCurrent();
  }

  focusLast() {
    this.currentOption = this.options[this.options.length - 1];
    this.focusCurrent();
  }

  /**
   * @param {HTMLElement} selectedOption
   * @return {void}
   */
  scrollOptionIntoView(selectedOption) {
    if (this.expanded && this.matches(":focus-within")) {
      selectedOption.scrollIntoView({ block: "nearest" });
    }
  }

  findFirstSelectedOption () {
    // When a multi-select listbox receives focus:
    // If none of the options are selected before the listbox receives focus, focus is set on the first option and there is no automatic change in the selection state.
    // If one or more options are selected before the listbox receives focus, focus is set on the first option in the list that is selected.
    // When a single-select listbox receives focus:
    //
    //     If none of the options are selected before the listbox receives focus, the first option receives focus. Optionally, the first option may be automatically selected.
    //     If an option is selected before the listbox receives focus, focus is set on the selected option.
    //
    const firstSelectedOption = this.options.find((el) => this.isSelected(el));

    if (firstSelectedOption) {
      this.currentSelectedOption = firstSelectedOption;
      this.focusCurrent();
      return;
    }
  }

  /**
   * @param {HTMLElement} el
   * @return {boolean}
   */
  isSelected(el) {
    const isOption = (el instanceof HTMLOptionElement || el.getAttribute("role") === "option")
    const isSelected =
      (
        /** @type {HTMLOptionElement} */ (el).selected === true
        || el.getAttribute("aria-selected") === "true"
      )
    return isOption && isSelected;
  }

  updateOptions() {
    const listbox = this.listbox
    if (!listbox) return

    if (!this.shadowRoot) return

    this.findFirstSelectedOption()

    const lightDOMOptions = /** @type {Array<HTMLOptionElement | RoleOption>} */ (Array.from(
      this.querySelectorAll("option, [role='option']")
    ));

    // const lightDOMOptions = /** @type {Array<HTMLOptionElement | RoleOption>} */ (Array.from(
    //   this.querySelectorAll("option, [role='option']")
    // ));

    this.options = lightDOMOptions

    this.selectedOptions = [];
    const selectedOptions = this.selectedOptions;

    if (this.options.length === 0) return;

    let hasSelected = false
    const multipleFormData = new FormData()

    this.options.forEach((option, index) => {
      // Sometimes people dont provide IDs, so we can fill it for them. We need ids for aria-activedescendant.
      // Because this lives in the lightDOM, we need to make sure we don't override existing ids.
      const id = uuidv4()
      this.assignRandomId(option, id);

      if (this.isSelected(option)) {
        selectedOptions.push(option);

        const value = /** @type {HTMLOptionElement} */ (option).value
        if (this.value == null) {
          this.value = value
          this.combobox.value = option.innerText
          hasSelected = true
        }

        if (this.multiple && this.name) {
          multipleFormData.append(this.name, value)
        }
      }
    });

    const currentSelectedOption = this.currentOption;

    if (!this.multiple) {
      if (currentSelectedOption) {
        // Wait for cloned nodes to render.
        setTimeout(() => {
          this.scrollOptionIntoView(currentSelectedOption)
        })
      }

      selectedOptions.forEach((optionEl) => {
        if (optionEl === this.currentOption) {
          return;
        }

        this.removeFocus(optionEl);
        // this.deselect(optionEl);
      });

      return;
    }

    /**
     * @type {null | HTMLElement}
     */
    let currentOption = null;

    this.options.forEach((option) => {
      const isActiveOption =
        /** @type {import("../option/option.js").default} */ (option).current === true
        || option.getAttribute("aria-current") === "true";

      if (!currentOption && isActiveOption) {
        currentOption = option;
      }

      if (option !== currentOption) {
        this.removeFocus(option);
      }
    });

    this.currentOption = currentOption
    this.value = multipleFormData
  }
}
