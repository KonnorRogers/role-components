// @ts-check

// https://codepen.io/smhigley/pen/JjoKgxb
// https://codepen.io/smhigley/pen/GRgjRVN
// https://codepen.io/smhigley/pen/BayzXbO
// Types:
// Listbox

// Select only vs Editable
// Single select vs multi-select

// Autocomplete types:
// autocomplete="off"
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
import RoleAnchoredRegion, { AnchoredRegionMixin, AnchoredRegionProperties } from "../anchored-region/anchored-region.js";

/**
 * @typedef {Object} OptionObject
 * @property {string | null} id - Unique identifier
 * @property {string} content - Text content
 * @property {string} value - The "value" to be submitted by the form.
 * @property {boolean} current - If it is the currently "focused" option
 * @property {boolean} selected - Whether or not the option is selected.
 * @property {boolean} focusable - Whether or not the option is part of autocomplete.
 */

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
export default class RoleCombobox extends AnchoredRegionMixin(LitFormAssociatedMixin(BaseElement)) {
  static baseName = "role-combobox";
  static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true }

  static dependencies = {
    'role-anchored-region': RoleAnchoredRegion
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
      [part~='popup']::part(popover) {
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
    ...(AnchoredRegionProperties()),
    expanded: { type: Boolean },
    autocomplete: {},
    multiple: { type: Boolean },
    defaultValue: { attribute: "value", reflect: true },
    selectedOptions: { type: Array, state: true, attribute: false },
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
    multipleSelectionType: {attribute: "multiple-selection-type"},

    // Properties
    _hasFocused: { attribute: false, state: true },
    _searchBuffer: { attribute: false, state: true },
    _searchBufferDebounce: { attribute: false, state: true },
    options: { attribute: false, state: true },
    currentOption: { attribute: false, state: true },
    __rangeStartOption: { attribute: false, state: true },
    // tabIndex: { reflect: true, attribute: "tabindex", type: Number }
  }

  constructor () {
    super()

    /**
     * @type {HTMLButtonElement | HTMLInputElement | null}
     */
    this.triggerElement = null
    this.listboxId = "role-listbox-" + uuidv4()

    /**
     * Any autocompletes of type `"off"`, `"inline"`, `"list"`, or `"both"` will automatically make the triggerElement editable.
     * @type {'' | "off" | "inline" | "list" | "both"}
     */
    this.autocomplete = ''

    this.placement = "bottom"

    /**
     * If set to "freeflow", it will be one single text input with delimited values.
     *   If set to "confirm", you will only enter 1 option at a time, and then need to confirm selection, and then the input will clear, and then you will add another selection.
     * @type {"freeflow" | "confirm"}
     */
    this.multipleSelectionType = "freeflow"

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
     * @type {OptionObject[]}
     */
    this.selectedOptions = []

    /**
     * @type {OptionObject[]}
     */
    this.options = []

    /**
     * @type {null | OptionObject}
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
     * Used internally for range selections
     * @type {null | OptionObject}
     */
    this.__rangeStartOption = null

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
     *   like a native `<select>`. The default is a "string".
     * @type {"formdata" | "string"}
     */
    this.valueType = "string"

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
   * @type {HTMLElement["focus"]}
   */
  focus (...args) {
    this.triggerElement?.focus(...args)
  }


  /**
   * @param {InputEvent} event
   */
  handleInput (event) {
    const triggerElement = this.triggerElement
    if (!triggerElement) { return }
    if (event.target !== triggerElement) { return }
    if (!this.isEditable) { return }

    if (this.autocomplete === "list" || this.autocomplete === "both") {
      if (!this.expanded) {
        this.expanded = true
      }
    }

    if (this.multiple) {
      this.handleMultipleEditableInput(event, triggerElement)
      return
    }

    this.handleSingleEditableInput(event, triggerElement)
  }

  /**
   * @param {string} value
   */
  splitValue (value) {
    return value.split(this.delimiter + this.spacer).join(this.delimiter).split(this.delimiter)
  }

  /**
   * @param {InputEvent} event
   * @param {HTMLButtonElement | HTMLInputElement} triggerElement
   */
  handleMultipleEditableInput (event, triggerElement) {
    if (!triggerElement) return

    if (this.multipleSelectionType === "freeflow") {
      this.__handleFreeflowInput(event, triggerElement)
      return
    }

    if (this.multipleSelectionType === "confirm") {
      this.__handleConfirmInput(event, triggerElement)
    }
  }

  /**
   * @param {string} finalString
   * @param {InputEvent} event
   * @private
   */
  __shouldSelectSuggestedOption (finalString, event) {
    return Boolean(!(
      event.inputType === "deleteContentBackward"
      || !["list", "both", "inline"].includes(this.autocomplete)
    ) && finalString)
  }


  /**
   * @param {string} finalString
   * @param {InputEvent} event
   * @param {typeof this.selectedOptions} newSelectedOptions
   */
  __findSuggestedOption (finalString, event, newSelectedOptions) {
    /**
     * @type {null | OptionObject}
     */
    let suggestedOption = null

    if (finalString && this.__shouldSelectSuggestedOption(finalString, event)) {
      // @TODO: Should we show current string, or the autocompleted string?
      suggestedOption = (this.options.find((option) => {
        return (
          // Check to make sure we're not trying to find an option we've already selected.
          newSelectedOptions.findIndex((opt) => opt.id === option.id) === -1
          && option.content.match(this.stringToRegex(finalString))
        )
      })) || null
    }

    return suggestedOption
  }

  /**
   * @param {InputEvent} event
   * @param {HTMLButtonElement | HTMLInputElement} triggerElement
   */
  __handleConfirmInput (event, triggerElement) {
    const val = triggerElement.value

    const finalString = val

    const shouldSelectSuggestedOption = this.__shouldSelectSuggestedOption(finalString, event)
    const suggestedOption = this.__findSuggestedOption(finalString, event, this.selectedOptions)

    if (suggestedOption) {
      this.selectedOptions.pop()
      this.selectedOptions.push(suggestedOption)
    }

    if (!finalString) { return }

    if ((this.autocomplete === "both" || this.autocomplete === "inline")) {
      if ("setSelectionRange" in triggerElement) {
        if (suggestedOption) {
          const remainingString = suggestedOption.content.slice(finalString.length, suggestedOption.content.length)
          const previousCharacters = finalString
          const combinedString = previousCharacters + remainingString
          this.updateTriggerElementTextContentAndValue(combinedString)
          triggerElement.setSelectionRange(previousCharacters.length, combinedString.length)
        }
      }
    }

    if (suggestedOption) {
      this.setCurrent(suggestedOption)
    }

    if (!suggestedOption && this.selectedOptions.length) {
      this.setCurrent(this.selectedOptions[this.selectedOptions.length - 1])
    }

    this.requestUpdate("selectedOptions")
  }



  /**
   * @param {InputEvent} event
   * @param {HTMLButtonElement | HTMLInputElement} triggerElement
   * @private
   */
  __handleFreeflowInput (event, triggerElement) {
    const val = triggerElement.value

    const prevSelectedOptions = this.selectedOptions

    const splitValue = this.splitValue(val)

    const newSelectedOptions = splitValue.filter(Boolean).map((str) => {
      const option = this.options.find((option) => option.content === str)

      const optionId = option?.id || null

      /** @type {OptionObject} */
      return {
        id: optionId,
        content: option?.content || str,
        value: option?.value || str,
        current: false,
        selected: true,
        focusable: true,
      }
    })

    const finalString = splitValue[splitValue.length - 1]

    const shouldSelectSuggestedOption = this.__shouldSelectSuggestedOption(finalString, event)
    const suggestedOption = this.__findSuggestedOption(finalString, event, newSelectedOptions)

    if (suggestedOption) {
      newSelectedOptions.pop()
      newSelectedOptions.push(suggestedOption)
    }

    prevSelectedOptions.forEach((prevOption) => {
      if (newSelectedOptions.find((newOption) => newOption.id && prevOption.id && newOption.id === prevOption.id)) {
        return
      }

      this.deselect(prevOption)
    })

    let finalSelectedOptionInList = null
    let anyOptionExistsInList = false

    newSelectedOptions.forEach((opt, index) => {
      const isLastOption = newSelectedOptions.length - 1 === index

      if (opt.id) {
        anyOptionExistsInList = true
        if (isLastOption) {
          finalSelectedOptionInList = opt
        }
      }

      this.select(opt)
    })

    if (!shouldSelectSuggestedOption) {
      if (!anyOptionExistsInList) {
        this.deselectAll()
      }

      if (finalSelectedOptionInList) {
        this.setCurrent(finalSelectedOptionInList)
      }

      this.selectedOptions = newSelectedOptions
      return
    }

    if (!finalString) { return }

    if ((this.autocomplete === "both" || this.autocomplete === "inline")) {
      if ("setSelectionRange" in triggerElement) {
        if (suggestedOption) {
          const remainingString = suggestedOption.content.slice(finalString.length, suggestedOption.content.length)
          const previousCharacters = splitValue.join(this.delimiter + this.spacer)
          const combinedString = previousCharacters + remainingString
          this.updateTriggerElementTextContentAndValue(combinedString)
          triggerElement.setSelectionRange(previousCharacters.length, combinedString.length)
        }
      }
    }

    if (suggestedOption) {
      this.setCurrent(suggestedOption)
    }

    if (finalSelectedOptionInList) {
      this.setCurrent(finalSelectedOptionInList)
    }

    this.selectedOptions = newSelectedOptions
  }

  /**
   * @param {InputEvent} event
   * @param {typeof this.triggerElement} triggerElement
   */
  handleSingleEditableInput (event, triggerElement) {
    if (!triggerElement) return

    const val = triggerElement.value

    /**
     * @type {null | undefined | OptionObject}
     */
    let currentOption

    if (event.inputType !== "deleteContentBackward" && (this.autocomplete === "both" || this.autocomplete === "inline")) {
      currentOption = this.options.find((option) => option.content.match(this.stringToRegex(val)))
      const valueSize = val.length

      if ("setSelectionRange" in triggerElement) {
        setTimeout(() => {
          if (currentOption) {
            triggerElement.setSelectionRange(valueSize, currentOption.content.length)
          }
        })
      }
    } else {
      currentOption = this.options.find((option) => option.content === val)
    }

    if (val !== this.value) {
      if (this.currentOption) {
        this.deselect(this.currentOption)
      }

      if (currentOption) {
        if (this.autocomplete === "list" || this.autocomplete === "both" || this.autocomplete === "inline") {
          this.setCurrent(currentOption)
        }
        this.select(currentOption)
      } else {
        this.value = val
      }
    }
  }

  /**
   * @param {RoleOption} el
   * @returns {OptionObject}
   */
  optionElementToOptionObject (el) {
    return {
      id: el.id || el.getAttribute("id") || "",
      content: el.innerText,
      value: /** @type {string} */ (el.value) ?? el.innerText,
      current: el.current || el.getAttribute("aria-current") === "true",
      selected: el.selected || el.getAttribute("aria-selected") === "true",
      focusable: true,
    }
  }


  /**
   * @param {{target: null | RoleOption}} event
   */
  handleOptionFocus (event) {
    if (!this.expanded) return

    const { target } = event

    if (!target) return

    this.currentOption = this.optionElementToOptionObject(target)
    this.focusCurrent()
  }

  /**
   * @param {Event} e
   */
  handleInputClick (e) {
    const hasTrigger = e.composedPath().includes(/** @type {EventTarget} */ (this.triggerElement))
    if (hasTrigger && this.triggerElement) {
      this.triggerElement.focus()
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
    if (!el.id || !el.hasAttribute("id")) {
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
    this.triggerElement?.setAttribute("aria-controls", listboxElement.id)
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
  updateTriggerElement () {
    /**
     * @type {HTMLButtonElement | HTMLInputElement | null}
     */
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
      ${this.selectedOptions.filter((option) => (option.content || "").trim() !== "").map((option) => {
        return html`<span class="visually-hidden" id=${`remove-option-${option.id}`}>Remove "${option.content}" option from combobox</span>`
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
        ${this.selectedOptions.filter((option) => (option.content || "").trim() !== "").map((option, index) => {
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
                @click=${() => {
                  this.deselect(option)
                  if (this.isEditableMultipleCombobox) {
                    this.updateMultipleValue(true)
                  }
                }}
              >
                <span>${option.content}</span>
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
        <role-anchored-region
          part="popup anchored-region"
          exportparts="
            popover,
            popover--active,
            popover--fixed,
            popover--has-arrow,
            arrow,
            hover-bridge,
            hover-bridge--visible
          "
          sync="width"
          auto-size="both"
          ?active=${this.expanded}
          .anchor=${this.anchor}
          .placement=${"bottom"}
          .strategy=${this.strategy}
          .distance=${this.distance || 6}
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
          .autoSizeBoundary=${this.autoSizeBoundary}
          .autoSizePadding=${this.autoSizePadding}
          .hoverBridge=${this.hoverBridge}
          class="${this.active ? '' : 'visually-hidden'}"
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
            <slot name="trigger" @slotchange=${this.updateTriggerElement}></slot>
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
        </role-anchored-region>
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
    this.deselectAll()

    // Need to wait for next tick to update.
    setTimeout(() => {
      this.updateOptions()
    })
  }

  /**
   * @returns {boolean} - Returns true if its a multi-select string delimited combobox.
   */
  get isEditableMultipleCombobox () {
    return this.multiple && this.isEditable
  }

  /**
   * @override
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate(changedProperties) {
    const triggerElement = this.triggerElement

    if (triggerElement) {
      this.updateTriggerElement()
    }

    if (changedProperties.has("value")) {
      this.updateComplete.then(() => {
        this.dispatchEvent(new Event("change", { bubbles: true, composed: true }))
        this.dispatchEvent(new Event("input", { bubbles: true, composed: true }))
      })
    }

    if (changedProperties.has("currentOption")) {
      const previousActiveOption = changedProperties.get("currentOption");

      if (this.currentOption !== previousActiveOption) {
        if (previousActiveOption) {
          this.removeCurrent(previousActiveOption);
        }
      }
    }

    super.willUpdate(changedProperties);
  }

  /**
   * @param {OptionObject} option
   */
  setCurrent(option) {
    if (!option) return

    const optionEl = this.findOptionElement(option)

    option.current = true

    if (optionEl) {
      optionEl.current = true
      optionEl.setAttribute("aria-current", "true")
    }

    if (option.id !== this.currentOption?.id) {
      this.currentOption = option
    }
  }

  /**
   * @param {OptionObject} option
   */
  removeCurrent(option) {
    const optionEl = this.findOptionElement(option)
    option.current = false

    if (optionEl) {
      optionEl.current = false
    }
  }

  /**
   * @param {OptionObject} option
   * @returns {RoleOption | null}
   */
  findOptionElement (option) {
    if (!option?.id) { return null }
    return this.querySelector(`#${option.id}`)
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

    const currentOption = this.optionElementToOptionObject(/** @type {RoleOption} */ (option));

    if (this.multiple) {
      if (evt.shiftKey) {
        this.selectFromRangeStartToCurrent()
      } else {
        this.toggleSelected(currentOption);
      }

      // Updates triggerElement.
      this.updateMultipleValue(true)
    }

    this.setCurrent(currentOption)
    this.focusCurrent();

    if (!this.multiple) {
      this.toggleSelected(currentOption)
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

    this.scrollOptionElementIntoView(option)
  }

  get currentOptionIndex() {
    return this.options.findIndex((el) => el.id === this.currentOption?.id);
  }

  get currentFocusableOptionIndex() {
    return this.focusableOptions.findIndex((el) => el.id === this.currentOption?.id);
  }

  /**
   * Reset range when shiftKey goes up
   * @param {KeyboardEvent} evt
   */
  handleKeyUp (evt) {
    if (evt.key === "Shift") {
      this.__rangeStartOption = this.currentOption
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

    const triggerElementFocused = evt.composedPath().includes(/** @type {EventTarget} */ (this.triggerElement))

    if (evt.key === "Escape") {
      evt.preventDefault()
      if (this.expanded === false && this.triggerElement && triggerElementFocused) {
        this.triggerElement.value = ""
        this.triggerElement.textContent = " "
        this.value = null
        this.deselectAll()
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
        // If a completion is selected, we just let it fall through.
        if (!this.completionSelected) {
          this.toggleSelected(this.currentOption)
        }

        if (this.multiple) {
          this.updateMultipleValue(true)
        }

        if (this.triggerElement && "setSelectionRange" in this.triggerElement) {
          this.triggerElement.setSelectionRange?.(this.triggerElement.value.length, this.triggerElement.value.length)
        }
      }

      // Close the combobox for single select.
      if (!this.multiple) {
        this.expanded = false
        return
      }
    }

    if (evt.key === "Shift") {
      this.__rangeStartOption = this.currentOption
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
    const rangeStartOption = this.__rangeStartOption
    const currentOption = this.currentOption

    if (currentOption == null) return

    const currentOptionIndex = this.currentOptionIndex

    if (rangeStartOption == null) {
      this.selectRange({ from: 0, to: currentOptionIndex })
    }

    if (rangeStartOption?.id && rangeStartOption.id === currentOption.id) {
      this.select(currentOption)
      return
    }

    const rangeStartIndex = this.options.findIndex((el) => {
      return el.id === rangeStartOption?.id
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
        this.select(opt)
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
   * Escape characters for regex matching.
   * @param {string} str
   */
  escapeRegexChars (str) {
    return str
      .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      .replace(/-/g, '\\x2d')
  }

  /**
   * @param {string} str
   */
  stringToRegex (str) {
    // https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
    return new RegExp(
      "^" + // start of string
      this.escapeRegexChars(str), // Escape funky characters
      'gi' // Global, case insensitive
    )
  }

  focusElementFromSearchBuffer() {
    const searchBuffer = this._searchBuffer;

    const regex = this.stringToRegex(searchBuffer.toLowerCase())

    const matchedOption = this.options.find((el) => {
      // Native select only matches by case in-equal innerText.
      return el.content.toLowerCase().match(regex);
    });

    if (matchedOption && this.currentOption !== matchedOption) {
      this.currentOption = matchedOption;
      this.focusCurrent();
    }
  }

  /**
   * @param {OptionObject} option
   */
  select(option) {
    const optionElement = this.findOptionElement(option)

    // We dont want to simulate clicks if its not open.
    if (this.expanded && optionElement?.hasAttribute("href")) {
      optionElement.click()
    }

    if (!this.multiple) {
      this.deselectAll()
      this.selectedOptions = []
    }

    if (!(this.selectedOptions.find((opt) => opt.id === option.id))) {
      this.selectedOptions = this.selectedOptions.concat(option);
      this.requestUpdate("selectedOptions")
    }

    // If a user has a completion selected, and then chooses an option, we're in this fun scenario where we need to delete the previous "selectedOption" that they're typing in, but maintain the new selection.
    if (this.isEditableMultipleCombobox && this.completionSelected) {
      this.selectedOptions.splice(this.selectedOptions.length - 2, 1)
      this.requestUpdate("selectedOptions")
    }

    option.selected = true

    if (optionElement) {
      optionElement.selected = true

      // We don't want to override normal HTMLOptionElement semantics.
      if (!(optionElement instanceof HTMLOptionElement)) {
        optionElement.setAttribute("aria-selected", "true");
      }
    }

    // this.updateOptions()
    this.debounce(() => this.updateOptions(), {
      key: this.updateOptions,
      wait: 1
    })

    const event = new SelectedEvent("role-selected", { selectedOption: option, selectedElement: optionElement });
    ;(optionElement || this).dispatchEvent(event);

    if (!this.multiple) {
      if (this.currentOption) {
        this.value = option.value ?? option.content

        this.updateTriggerElementTextContentAndValue(option.content)
      }

      return
    }
  }

  /**
   * @param {OptionObject} option
   */
  deselect(option) {
    const selectedElement = this.findOptionElement(option)

    option.selected = false

    const event = new SelectedEvent("role-deselected", { selectedOption: option, selectedElement });
    ;(selectedElement || this).dispatchEvent(event);

    const selectedIndex = this.selectedOptions.findIndex((opt) => opt === option || opt.id === option.id);
    if (selectedIndex >= 0) {
      this.selectedOptions.splice(selectedIndex, 1)
      this.selectedOptions = this.selectedOptions
      this.requestUpdate("selectedOptions")
    }

    if (selectedElement) {
      selectedElement.selected = false;
      selectedElement.removeAttribute("aria-selected");
    }
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
   * @param {OptionObject} option
   */
  toggleSelected(option) {
    if (this.isSelected(option)) {
      this.deselect(option);
      return;
    }

    this.select(option);
  }

  focusCurrent() {
    // if (!this.expanded) return

    const selectedOption = this.currentOption;

    if (!selectedOption) {
      this.focusFirst()
      return
    }

    const combobox = this.triggerElement

    if (!combobox) return

    // Common to both multi + single
    this.triggerElement?.setAttribute(
      "aria-activedescendant",
      selectedOption.id || "",
    );

    // For some reason something is setting "current" after this only when using VoiceOver, so re-set it in a setTimeout.
    this.setCurrent(selectedOption);
    requestAnimationFrame(() => {
      this.setCurrent(selectedOption);
      this.scrollOptionIntoView(selectedOption);
    })
  }

  get focusableOptions () {
    return this.options.filter((opt) => opt.focusable === true)
  }

  /**
   * @param {number} index
   */
  focusAt(index) {
    if (this.wrapSelection) {
      index = wrap(0, index, this.focusableOptions.length - 1);
    } else {
      index = clamp(0, index, this.focusableOptions.length - 1);
    }

    const option = this.focusableOptions[index];
    this.setCurrent(option)
    this.focusCurrent();
  }

  focusNext() {
    this.focusAt(this.currentFocusableOptionIndex + 1);
  }

  focusPrevious() {
    this.focusAt(this.currentFocusableOptionIndex - 1);
  }

  focusFirst() {
    const currentOption = this.focusableOptions[0]
    if (!currentOption) return
    this.setCurrent(currentOption)
    this.focusCurrent();
  }

  focusLast() {
    const currentOption = this.focusableOptions[this.focusableOptions.length - 1];
    if (!currentOption) return
    this.setCurrent(currentOption)
    this.focusCurrent();
  }

  /**
   * @param {OptionObject} selectedOption
   * @return {void}
   */
  scrollOptionIntoView(selectedOption) {
    const optionElement = this.findOptionElement(selectedOption)

    if (!optionElement) return
    this.scrollOptionElementIntoView(optionElement)
  }

  /**
   * @param {HTMLElement} optionElement
   * @return {void}
   */
  scrollOptionElementIntoView(optionElement) {
    if (this.expanded && this.matches(":focus-within")) {
      this.triggerElement?.focus()
      setTimeout(() => {
        optionElement.scrollIntoView({ block: "nearest" });
      })
    }
  }

  // findFirstSelectedOption () {
  //   // When a multi-select listbox receives focus:
  //   // If none of the options are selected before the listbox receives focus, focus is set on the first option and there is no automatic change in the selection state.
  //   // If one or more options are selected before the listbox receives focus, focus is set on the first option in the list that is selected.
  //   // When a single-select listbox receives focus:
  //   //
  //   //     If none of the options are selected before the listbox receives focus, the first option receives focus. Optionally, the first option may be automatically selected.
  //   //     If an option is selected before the listbox receives focus, focus is set on the selected option.
  //   //
  //   const firstSelectedOption = this.options.find((el) => this.isSelected(el));
  //
  //   if (firstSelectedOption) {
  //     return;
  //   }
  // }

  /**
   * @param {OptionObject} option
   * @return {boolean}
   */
  isSelected(option) {
    if (option.selected === true) return true

    const el = this.findOptionElement(option)

    if (!el) return false

    const isOption = (el instanceof HTMLOptionElement || el.getAttribute("role") === "option")
    const isSelected =
      (
        /** @type {RoleOption} */ (el).selected === true
        || el.getAttribute("aria-selected") === "true"
      )
    return isOption && isSelected;
  }

  /** @return {NodeListOf<HTMLOptionElement | RoleOption>} */
  get selectableOptions () {
    return this.querySelectorAll(":is(option, [role='option']):not(:disabled, [disabled])")
  }

  get completionSelected () {
    return (
      this.triggerElement
      && "selectionEnd" in this.triggerElement
      && this.triggerElement.selectionStart !== this.triggerElement.selectionEnd
    )
  }

  updateOptions() {
    if (!this.shadowRoot) return

    const listbox = this.listbox
    const combobox = this.triggerElement
    if (!listbox) return
    if (!combobox) return

    const options = [...this.selectableOptions].map((optionElement) => {
      // Sometimes people dont provide IDs, so we can fill it for them. We need ids for aria-activedescendant.
      // Because this lives in the lightDOM, we need to make sure we don't override existing ids.
      this.assignRandomId(optionElement, uuidv4().slice(0, 8));

      return this.optionElementToOptionObject(/** @type {RoleOption} */ (optionElement))
    })

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
    let searchRegex = this.stringToRegex(value)
    let lastOptionSelected = false

    if (this.isEditableMultipleCombobox) {
      const splitValue = this.splitValue(value)
      const finalString = splitValue[splitValue.length - 1]
      searchRegex = this.stringToRegex(finalString)

      const finalSelectedOption = this.selectedOptions[this.selectedOptions.length - 1]
      lastOptionSelected = Boolean(finalSelectedOption && finalSelectedOption.id)
    }

    for (const option of optionsSet) {
      let hasMatch = filterResults === false || !(value) || lastOptionSelected

      if (!hasMatch) {
        hasMatch = Boolean(
          option.content?.match(searchRegex) ||
          option.value?.match(searchRegex)
        )
      }

      const optionEl = this.findOptionElement(option)

      if (!hasMatch) {
        if (optionEl) {
          optionEl.style.display = "none"
        }
        option.focusable = false
        continue
      }

      option.focusable = true
      if (optionEl && optionEl.style.display === "none") {
        optionEl.style.display = "";
      }

      if (this.isSelected(option)) {
        if (this.multiple) {
          if (!this.selectedOptions.find((opt) => opt.id === option.id)) {
            this.selectedOptions.push(option)
          }
        }

        if (!this.multiple && hasSelected) {
          this.deselect(option)
        }

        const value = option.value
        if (!this.multiple && this.value == null) {
          this.value = value
          this.updateTriggerElementTextContentAndValue(option.content)
        }

        if (!this.currentOption) {
          this.setCurrent(option)
          this.focusCurrent()
          hasSelected = true

          if (!this.multiple) {
            this.select(option)
          }
        }
      }
    };

    this.options = [...optionsSet]

    if (!this.currentOption) {
      this.focusFirst()
    }

    if (!this.multiple) {
      this.selectedOptions.forEach((option) => {
        if (option.id === this.currentOption?.id) {
          return;
        }

        this.removeCurrent(option);
      });

      return;
    }

    let currentOption = this.currentOption;

    this.options.forEach((option) => {
      const isActiveOption = option.current === true

      if (!currentOption && isActiveOption) {
        currentOption = option;
        this.setCurrent(currentOption)
      }

      if (option.id !== currentOption?.id) {
        this.removeCurrent(option);
      }
    });

    // if (currentOption) {
    //   this.setCurrent(currentOption)
    // }

    // Don't force updates if the trigger element is being used.
    if (this.triggerElement && this.triggerElement.matches(":focus-within")) {
      this.updateMultipleValue()
    } else {
      this.updateMultipleValue(true)
    }
  }

  get multipleFormDataAndStringValue () {
    const formData = new FormData()

    /** @type {string[]} */
    const contentAry = []

    /** @type {string[]} */
    const valueAry = []

    this.selectedOptions.forEach((option) => {
      formData.append(this.name, option.value ?? option.content)
      valueAry.push(option.value ?? option.content)
      contentAry.push(option.content)
    })


    const delimiterSeparatedValue = valueAry.join(this.delimiter + this.spacer)
    const delimiterSeparatedContent = contentAry.join(this.delimiter + this.spacer)

    return { formData, delimiterSeparatedValue, delimiterSeparatedContent }
  }

  /**
   * Updates formData / combobox.value
   * @param {boolean} [force=false]  - whether or not to force update a new value
   */
  updateMultipleValue (force = false) {
    const { formData, delimiterSeparatedValue, delimiterSeparatedContent } = this.multipleFormDataAndStringValue

    if (this.valueType === "formdata") {
      this.value = formData
    } else {
      this.value = delimiterSeparatedValue
    }

    if (this.multipleSelectionType === "confirm") {
      return
    }

    if (force) {
      this.updateTriggerElementTextContentAndValue(delimiterSeparatedContent)
      return
    }

    if (this.triggerElement) {
      this.updateTriggerElementTextContentAndValue(this.triggerElement.value)
    }
  }

  /**
   * @param {string} str
   */
  updateTriggerElementTextContentAndValue (str) {
    const triggerElement = this.triggerElement

    if (!triggerElement) return

    if (triggerElement.value !== str) {
      triggerElement.value = str
    }

    // Use textContent instead of innerText to avoid infinite loops of MO on `<input>` elements.
    if (triggerElement.textContent !== str) {
      triggerElement.textContent = str
    }

    if ("setSelectionRange" in triggerElement) {
      // The page will scroll to the input if we dont check that the input is currently focused.
      if (!this.completionSelected && this.triggerElement?.matches(":focus-within")) {
        triggerElement.setSelectionRange(-1, -1)
      }
    }
  }
}

