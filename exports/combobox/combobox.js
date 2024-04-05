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
// value-type="string | formdata"
// delimiter = ', '
// show-buttons=""

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
 * @tagname role-combobox
 */
export default class RoleCombobox extends LitFormAssociatedMixin(BaseElement) {
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
      :host {
      }
      [name="trigger"]::slotted(input) {
        font-size: 1.1em;
        padding-inline-start: 0.4em;
        padding-inline-end: 0.4em;
        line-height: 1.8;
        -webkit-appearance: none;
        appearance: none;
        background: Field;
        color: FieldText;
        border: 1px solid GrayText;
      }

      [name="trigger"]::slotted(*:focus-within) {
        outline: 2px solid dodgerblue;
      }

      /** because position: absolute; + isolation: isolate; don't always pierce. */
      [part~='popup']::part(popup) {
        z-index: 1;
      }

      [part~="base"] {
        display: grid;
        grid-template-rows: minmax(0, auto) minmax(0, 1fr);
        gap: 8px;
      }
    `
  ]

  static properties = {
    ...formProperties,
    expanded: { type: Boolean },
    autocomplete: {},
    multiple: { type: Boolean },
    defaultValue: { attribute: "value", reflect: true },
    // selectedOptions: { type: Array, state: true, attribute: false },
    // currentOption: { state: true, attribute: false },
    wrapSelection: {
      attribute: "wrap-selection",
      type: Boolean,
    },
    editable: {type: Boolean},
    filterResults: {type: Boolean, attribute: "filter-results"},
    searchBufferDelay: {
      attribute: "search-buffer-delay",
      type: Number,
      reflect: true,
    },
    valueType: {
      attribute: "value-type"
    },
    delimiter: {},
    spacer: {},
    showEmptyResults: { type: Boolean, attribute: "show-empty-results" },

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
     * Any autocompletes of type `"off"`, `"inline"`, `"list"`, or `"both"` will automatically make the triggerElement editable.
     * @type {'' | "off" | "inline" | "list" | "both"}
     */
    this.autocomplete = ''

    /**
     * If true, the `<input>` element provided is not treated as readonly, and rather as an editable input. This can be omitted
     *  if you use any of the possible `autocomplete` attributes. Do not use this to check if the combobox is editable.
     *  instead, use `this.isEditable` to check if the triggerElement is editable.
     * @type {boolean}
     */
    this.editable = false


    /**
     * Used for multiple select comboboxes that use `value-type="string"`. The default is a comma.
     * @type {string}
     */
    this.delimiter = ','

    /**
     * Used for multiple select comboboxes that use `value-type="string"`. The default is a space.
     * @type {string}
     */
    this.spacer = " "

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
     * Whether or not to filter results based on what is typed into the combobox.
     * @type {boolean}
     */
    this.filterResults = false

    /**
     * @type {string}
     */
    this.role = "presentation";
    this.internals.role = "presentation";

    /**
     * @type {string}
     */
    this.label = "";

    /**
     * If true, or `show-empty-results` attribute is present, it will show the "no-results-found" slot.
     * @type {boolean}
     */
    this.showEmptyResults = false

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

    /**
     * Used for multiple selects. You can either have a string, or submit as multiple parameters in FormData
     *   like a native `<select>`. The default is a "string"
     * @type {"formdata" | "string"}
     */
    this.valueType = "string"

    /**
     * @type {HTMLButtonElement | HTMLInputElement}
     */
    this.triggerElement

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
      for (const _mutation of mutations) {
        this.debounce(() => { this.updateOptions(); }, {
          wait: 10,
          key: this.updateOptions,
        });


        // We really don't care about the mutations, we just need to know if things are updating.
        break;
      }
    });

    this.addEventListener("keydown", this.eventHandler.get(this.handleKeyDown));
    this.addEventListener("click", this.eventHandler.get(this.handleInputClick));
    this.addEventListener("click", this.eventHandler.get(this.handleOptionClick));
    this.addEventListener("pointermove", this.eventHandler.get(this.handleOptionHover))
    this.addEventListener("role-focus", this.eventHandler.get(this.handleOptionFocus))

    this.addEventListener("input", this.eventHandler.get(this.handleInput))
    this.addEventListener("keydown", this.eventHandler.get((/** @type {KeyboardEvent} */ e) => {
      if (e.key === "Tab") {
        this.expanded = false
      }
    }))
  }

  /**
   * @param {{target: null | RoleOption}} event
   */
  handleOptionFocus (event) {
    if (!this.expanded) return

    const { target } = event

    if (!target) return

    this.currentOption = target
    this.focusCurrent()
  }

  /**
   * @param {Event} e
   */
  handleInputClick (e) {
    const trigger = e.target.closest("[slot='trigger']")
    if (trigger) {
      this.combobox.focus()
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

  get listbox () {
    return this.querySelector(":scope > [slot='listbox']")
  }

  get isEditable () {
    return this.editable || this._editableAutocompletes.includes(this.autocomplete)
  }

  /**
   * Adds proper attributes to the slotted listbox element
   */
  updateListboxElement () {
    const listboxElement = this.querySelector(":scope > [slot='listbox']")

    if (!listboxElement) return

    listboxElement.setAttribute("role", "listbox")
    listboxElement.setAttribute("tabindex", "-1")
    if (!listboxElement.id) {
      listboxElement.setAttribute("id", this.listboxId)
    }
    this.combobox?.setAttribute("aria-controls", listboxElement.id)
  }

  /**
   * @param {Event} e
   */
  handleInputFocus (e) {
    if (!this.isEditable) {
      /**
       * @type {null | HTMLInputElement}
       */
      // @ts-expect-error
      const target = e.target

      setTimeout(() => {
        // Readonly inputs will select the text giving the impression its editable.
        target?.setSelectionRange?.(null, null)
      })
    }
  }

  /**
   * Adds proper attributes to the slotted input element
   */
  updateInputElement () {
    const triggerElement = this.querySelector(":scope > [slot='trigger']")
    this.triggerElement = triggerElement

    if (!triggerElement) return

    const attributes = [
      ["role", "combobox"],
      ["aria-haspopup", "listbox"],
      ["aria-controls", this.listbox?.id || this.listboxId],
      ["aria-activedescendant", this.currentOption?.id || ""],
      ["aria-autocomplete", this.autocomplete || ""],
      // ["autocomplete", this.autocomplete || "list"],
      ["spellcheck", "off"],
      ["aria-expanded", this.expanded.toString()]
    ]

    /**
     * @type {Array<[string, boolean]>}
     */
    const booleanAttributes = [
      ["readonly", !this.isEditable]
    ]

    for (const [attr, value] of attributes) {
      if (triggerElement.getAttribute(attr) !== value) {
        triggerElement.setAttribute(attr, value)
      }
    }

    for (const [booleanAttr, bool] of booleanAttributes) {
      triggerElement.toggleAttribute(booleanAttr, bool)
    }

    triggerElement.addEventListener("focus", this.eventHandler.get(this.handleInputFocus))

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

  renderSelectedOptions () {
    return html`
      ${this.selectedOptions.map((option) => {
        return html`<span class="visually-hidden" id=${`remove-option-${option.id}`}>Remove "${option.innerText}" option from combobox</span>`
      })}

      <ul
        role="list"
        part="selected-options"
        tabindex="-1"
        style="
          list-style-type: '';
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 0;
          padding: 0;
        "
      >
        ${this.selectedOptions.map((option) => {
          return html`
            <li>
              <button
                type="button"
                part="remove-button"
                aria-labelledby=${`remove-option-${option.id}`}
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  gap: 8px;
                  appearance: none;
                  background: ButtonFace;
                  color: ButtonText;
                  border: 1px solid ButtonText;
                "
                @click=${() => this.deselect(option)}
              >
                <span>${option.innerText}</span>
                <slot name="remove-icon">
                  <span aria-hidden="true">&times;</span>
                </slot>
              </button>
            </li>
          `
        })}
      </ul>
    `

  }

  get shouldShowEmptyResults () {
    return this.showEmptyResults && Boolean(this.options.length)
  }

  render () {
    const finalHTML = html`
      <div part="base">
        ${when(this.multiple && this.selectedOptions.length,
          () => this.renderSelectedOptions()
        )}
        <sl-popup
          id="popup"
          placement="bottom"
          sync="width"
          ?active=${this.expanded}
          hover-bridge
          distance="6"
          part="popup"
          auto-size="both"
        >
          <div
            slot="anchor"
            style="
              display: grid;
              grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto);
              grid-template-rows: minmax(0, 1fr);
            "
          >
            <slot name="prefix"><div></div></slot>
            <slot name="trigger" @slotchange=${this.updateInputElement}></slot>
            <slot name="suffix"><div></div></slot>
          </div>

          <div
            part="listbox"
            ?hidden=${this.showEmptyResults === false && !this.options.length}
            style="
              background-color: Canvas;
              border: 2px solid ButtonFace;
              max-height: var(--auto-size-available-height, 100%);
              overflow: auto;
            "
          >
            <slot ?hidden=${!this.options.length} name="listbox" @slotchange=${this.updateListboxElement}></slot>
            <slot ?hidden=${!this.shouldShowEmptyResults} name="no-results"><div style="padding: 1rem;">No results found</div></slot>
          </div>
        </sl-popup>
      </div>
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

    this.updateOptions()
    this.updateComplete.then(() => {
      this.updateOptions()
    })

    /**
     * We only care about "role" attribute changes
     */
    this.optionObserver.observe(this, {
      subtree: true,
      childList: true,
      attributes: true,
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
    this.value = null

    // Need to wait for next tick to update.
    setTimeout(() => {
      this.updateOptions()
    })
  }

  get combobox () {
    return /** @type {HTMLInputElement} */ (this.triggerElement)
  }

  /**
   * @returns {boolean} - Returns true if its a multi-select string delimited combobox.
   */
  get isEditableDelimitedCombobox () {
    return this.multiple && this.valueType === "string" && this.isEditable
  }

  /**
   * @override
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate(changedProperties) {
    const combobox = this.combobox

    if (combobox) {
      this.updateInputElement()
    }

    if (changedProperties.has("value")) {
      if (this.value && this.isEditableDelimitedCombobox) {
        // TODO: figure out delimited values.
      }

      this.updateComplete.then(() => {
        this.dispatchEvent(new Event("change", { bubbles: true, composed: true }))
      })
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
    // option.setAttribute("aria-current", "true");
    /** @type {import("../option/option.js").default} */ (option).current = true;
  }

  /**
   * @param {HTMLElement} option
   */
  removeFocus(option) {
    // option.setAttribute("aria-current", "false");
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

    if (this.triggerElement) {
      this.triggerElement.focus()
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
    if (evt.key === "Tab") {
      this.expanded = false
      return
    }

    const triggerElementFocused = evt.composedPath().includes(this.triggerElement)

    if (evt.key === "Escape") {
      evt.preventDefault()
      if (this.expanded === false && this.triggerElement && triggerElementFocused) {
        this.triggerElement.value = null
      }

      this.expanded = false
    }

    if (!triggerElementFocused) {
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

    if (evt.key === "Enter" || (!this.isEditable && evt.key === " ")) {
      if (!this.expanded) {
        evt.preventDefault()
        this.expanded = true
        return
      }
    }

    if (evt.key === "Enter") {
      evt.preventDefault()
      if (this.currentOption) {
        if (this.multiple) {
          this.toggleSelected(this.currentOption);
        } else {
          this.select(this.currentOption)
        }
        this.combobox.setSelectionRange?.(this.combobox.value.length, this.combobox.value.length)
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
      if (ctrlKeyPressed && !this.isEditable && evt.key.match(/^[aA]$/)) {
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
      if (this.expanded === false) {
        this.expanded = true
        this.focusCurrent()
        return
      }

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
   * @param {string} str
   */
  stringToRegex (str) {
    // https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
    return new RegExp(
      "^" + // start of string
      str // Escape funky characters
        .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        .replace(/-/g, '\\x2d'),
      'gi' // Global, case insensitive
    )
  }


  /**
   * @param {Event & { inputType: string }} e
   */
  handleInput (e) {
    const combobox = this.combobox
    if (!combobox) return
    if (e.target !== combobox) return

    const searchValue = combobox.value || "";

    // We dont focus elements if inline or off
    if (this.autocomplete !== "inline" && this.autocomplete !== "list" && this.autocomplete !== "both") {
      this.value = combobox.value
      return
    }

    if (!this.expanded) {
      this.expanded = true
    }

    // If we don't check this, we end up not being able to delete anything
    if (e.inputType === "deleteContentBackward" && !this.multiple) {
      this.deselectAll()
    }

    /**
     * @type {undefined | RegExp}
     */
    let regex

    /** @type {undefined | string} */
    let finalStr
    if (this.isEditableDelimitedCombobox) {
      if (combobox.value.endsWith(this.delimiter)) { return }
      if (combobox.value.endsWith(this.delimiter + this.spacer)) { return }

      // @TODO: check empty value

      const strs = searchValue.split(this.delimiter)

      /**
       * @type {typeof this.selectedOptions}
       */
      const selectedOptions = []

      strs.forEach((str) => {
        const opt = this.options.find((opt) => opt.innerText === str.trim())
        if (opt) {
          selectedOptions.push(opt)
        }
      })

      finalStr = strs.pop()?.trim()

      this.selectedOptions.forEach((selectedOption) => {
        if (!selectedOptions.includes(selectedOption)) {
          this.deselect(selectedOption)
        }
      })

      this.selectedOptions = selectedOptions

      if (finalStr) {
        this.finalString = finalStr
        regex = this.stringToRegex(finalStr)
      }
    } else {
      regex = this.stringToRegex(searchValue)
    }

    let matchedEl

    if (regex && e.inputType !== "deleteContentBackward") {
      matchedEl = this.options.find((el) => {
        // Native select only matches by case in-equal innerText.
        return el.innerText.toLowerCase().match(regex);
      });
    }

    if (!matchedEl) {
      if (!this.multiple) {
        this.deselectAll();
      }

      return
    }

    this.currentOption = /** @type {RoleOption} */ (matchedEl);

    // focusCurrent is going to set the value for us, but we need to track the `currentSize` and then after the
    // value is set, create a selection range.
    if (this.autocomplete === "inline" || this.autocomplete === "both") {
      this.finalString = undefined
      const currentSize = combobox.value.length

      this.select(matchedEl)
      setTimeout(() => {
        combobox.setSelectionRange(currentSize, combobox.value.length)
      }, 10)
    }

    this.focusCurrent();
    this.updateOptions()
    setTimeout(() => {
      this.finalString = undefined
    }, 20)
  }

  focusElementFromSearchBuffer() {
    const searchBuffer = this._searchBuffer;

    const regex = this.stringToRegex(searchBuffer.toLowerCase())

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
    const selectedOption = /** @type {RoleOption} */ (selectedElement)
    if (!this.multiple) {
      this.deselectAll()
    }

    if (!this.selectedOptions.includes(selectedOption)) {
      this.selectedOptions = this.selectedOptions.concat(selectedOption);
    }

    selectedOption.selected = true;

    // We don't want to override normal HTMLOptionElement semantics.
    if (!(selectedOption instanceof HTMLOptionElement)) {
      /** @type {HTMLElement} */ (selectedOption).setAttribute("aria-selected", "true");
    }

    // this.updateOptions()
    this.debounce(() => this.updateOptions(), {
      key: this.updateOptions,
      wait: 1
    })

    const event = new SelectedEvent("role-selected", { selectedElement: selectedOption });
    selectedOption.dispatchEvent(event);


    setTimeout(() => {
      if (this.expanded) {
        // Focus for a second for screen readers.
        // this.shadowRoot?.querySelector("[role~='list']")?.focus()
        // this.combobox.focus()
      }
    }, 10)

    if (!this.multiple) {
      if (this.currentOption) {
        this.value = this.currentOption.value ?? this.currentOption.innerText

        this.updateComboboxTextContentAndValue(this.currentOption.innerText)
      }

      return
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

    const selectedIndex = this.selectedOptions.indexOf(selectedElement);
    this.selectedOptions.splice(selectedIndex, 1)
    this.requestUpdate("selectedOptions")
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
  deselectAll(updateOptions = true) {
    for (const opt of this.options) {
      this.deselect(opt);
    }

    if (updateOptions) {
      this.updateOptions()
    }
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
    if (!this.expanded) return

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
      selectedElement.id,
    );

    this.setFocus(selectedElement);
    setTimeout(() => {
      this.scrollOptionIntoView(selectedElement);
    })
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
    if (!this.currentOption) return
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
      // this.triggerElement.scrollIntoView({ block: "center" })
      // selectedOption.focus()
      this.combobox.focus()
      setTimeout(() => {
        selectedOption.scrollIntoView({ block: "nearest" });
      })
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

  /** @return {NodeListOf<HTMLOptionElement | RoleOption>} */
  get selectableOptions () {
    return this.querySelectorAll(":is(option, [role='option']):not(:disabled, [disabled], [hidden])")
  }

  updateOptions() {
    if (!this.shadowRoot) return

    const listbox = this.listbox
    const combobox = this.combobox
    if (!listbox) return
    if (!combobox) return

    this.findFirstSelectedOption()

    const options = this.selectableOptions

    if (options.length === 0) return;

    const optionsSet = new Set([...options])

    this.selectedOptions = this.selectedOptions || [];

    let hasSelected = false

    const filterResults = this.filterResults
    let comboboxValue = (combobox.value || "")

    // When we preselect values, we need to make sure we check the selection.
    if ("selectionStart" in combobox) {
      comboboxValue = comboboxValue.slice(0, combobox.selectionStart || undefined)
    }

    const value = comboboxValue.trim()
    const searchRegex = this.stringToRegex(value)

    for (const option of optionsSet) {
      let hasMatch = filterResults === false || !(value)

      if (!hasMatch) {
        hasMatch = Boolean(
          option.innerText?.match(searchRegex) ||
          option.value?.match(searchRegex)
        )
      }

      if (!hasMatch) {
        option.style.display = "none"
        optionsSet.delete(option)
        continue
      }

      if (option.style.display === "none") {
        option.style.display = "";
      }

      // Sometimes people dont provide IDs, so we can fill it for them. We need ids for aria-activedescendant.
      // Because this lives in the lightDOM, we need to make sure we don't override existing ids.
      const id = uuidv4().slice(0, 8)
      this.assignRandomId(option, id);

      if (this.isSelected(option)) {
        if (this.multiple) {
          if (!this.selectedOptions.includes(option)) {
            this.selectedOptions.push(option)
          }
        }

        if (!this.multiple && hasSelected) {
          this.deselect(option)
        }

        const value = /** @type {HTMLOptionElement} */ (option).value
        if (!this.multiple && this.value == null) {
          this.value = value
          this.updateComboboxTextContentAndValue(option.innerText)
        }

        if (!this.currentOption) {
          this.currentOption = option

          if (!this.multiple) {
            this.select(option)
            hasSelected = true
          }
        }
      }
    };

    this.options = [...optionsSet]

    if (!this.multiple) {
      this.selectedOptions.forEach((optionEl) => {
        if (optionEl === this.currentOption) {
          return;
        }

        this.removeFocus(optionEl);
      });

      return;
    }

    /**
     * @type {null | HTMLOptionElement | RoleOption}
     */
    let currentOption = this.currentOption;

    this.options.forEach((option) => {
      const isActiveOption =
        /** @type {import("../option/option.js").default} */ (option).current === true
        // || option.getAttribute("aria-current") === "true";

      if (!currentOption && isActiveOption) {
        currentOption = option;
        this.currentOption = option
      }

      if (option !== currentOption) {
        this.removeFocus(option);
      }
    });

    this.currentOption = currentOption

    this.updateMultipleValue(this.finalString)
  }

  /**
   * @param {null | undefined | string} [additionalString] - An additional forced string for use with delimiter separated values.
   */
  updateMultipleValue (additionalString) {
    const multipleFormData = new FormData()
    this.selectedOptions.forEach((optionEl) => {
      multipleFormData.append(this.name, optionEl.value ?? optionEl.innerText)
    })

    if (additionalString) {
      multipleFormData.append(this.name, additionalString)
    }

    if (this.valueType === "formdata") {
      this.value = multipleFormData
    } else {
      const stringAry = []

      for (const [_key, value] of multipleFormData.entries()) {
        stringAry.push(value)
      }

      const delimiterSeparatedValue = stringAry.join(this.delimiter + this.spacer)

      this.value = delimiterSeparatedValue
      this.updateComboboxTextContentAndValue(delimiterSeparatedValue)
    }
  }

  /**
   * @param {string} str
   */
  updateComboboxTextContentAndValue (str) {
    const combobox = this.combobox

    if (!combobox) return

    if (combobox.value !== str) {
      combobox.value = str
    }

    // Use textContent instead of innerText to avoid infinite loops of MO on `<input>` elements.
    if (combobox.textContent !== str) {
      combobox.textContent = str
    }
  }
}
