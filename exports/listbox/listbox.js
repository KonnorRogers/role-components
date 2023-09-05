// @ts-check

import { BaseElement } from "../base-element.js";
import { css, html } from "lit"
import { hostStyles } from "../styles/host-styles.js";
import { wrap } from "../../internal/wrap.js";
import { clamp } from "../../internal/clamp.js";
import { uuidv4 } from "../../internal/uuid.js";
import { SelectedEvent } from "../events/selected-event.js";
import { isMacOs } from "../../internal/is-mac-os.js";

/**
 * A toolbar following the W3C Listbox pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 * Single-select "select follows focus" model.
 * Multi-select implements the recommendation here: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/#keyboard_interaction
 *   Shift + Down Arrow: Moves focus to and toggles the selected state of the next option.
 *   Shift + Up Arrow: Moves focus to and toggles the selected state of the previous option.
 *   Shift + Space: Selects contiguous items from the most recently selected item to the focused item.
 *   Control + Shift + Home: Selects the focused option and all options up to the first option. Optionally, moves focus to the first option.
 *   Control + Shift + End: Selects the focused option and all options down to the last option.
 *   Control + A: Selects all

 *   The currently hovered / focus option has [aria-current="true"]
 *   A selected option has [aria-selected="true"]
 * @customElement
 */
export default class RoleListbox extends BaseElement {
  static baseName = "role-listbox"

  static properties = {
    // Attributes
    label: { reflect: true },
    role: { reflect: true },
    wrapSelection: { attribute: "wrap-selection", reflect: true, type: Boolean },
    focusOnHover: { attribute: "focus-on-hover", reflect: true },

    // Maps to aria-multiselectable
    multiSelect: { reflect: true, type: Boolean, attribute: "multi-select" },
    searchBufferDelay: { attribute: "search-buffer-delay", type: Number, reflect: true },

    // Properties
    _hasFocused: { state: true },
    _searchBuffer: { state: true },
    _searchBufferDebounce: { state: true },
    options: { state: true },
    currentActiveOption: { state: true },
  }

  static styles = [
    hostStyles,
    css`
      /* Split these up in case a selector isnt supported */
      :host(:focus) [part~="base"],
      :host(:focus-within) [part~="base"],
      :host(:focus-visible) [part~="base"] {
        outline: transparent;
        border-color: blue;
        box-shadow: 0px 0px 3px 4px rgba(0,0,255,0.2);
      }

      [part~="base"] {
        height: 100%;
        max-height: 100%;
        overflow: auto;
        scroll-behavior: smooth;
        border: 2px solid gray;
      }
    `
  ]

  constructor () {
    super()

    /**
     * @type {HTMLElement[]}
     */
    this.selectedOptions = []

    /**
     * @type {boolean}
     */
    this.wrapSelection = false

    /**
     * @type {string}
     */
    this.role = "listbox"

    /**
     * @type {string}
     */
    this.label = ""

    /**
     * Internal buffer for searching the listbox.
     * @internal
     * @type {string}
     */
    this._searchBuffer = ""

    /**
     * timeoutId to clear the search buffer
     * @internal
     * @type {null | ReturnType<typeof setTimeout>}
     */
    this._searchBufferDebounce = null


    /**
     * Delay before the search buffer returns to an empty string
     * @type {number}
     */
    this.searchBufferDelay = 1000

    /**
     * @type {HTMLElement[]}
     */
    this.options = []

    /**
     * Allows multiple selections
     */
    this.multiSelect = false

    /**
     * @type {null | HTMLElement}
     */
    this.currentActiveOption = null

    /**
     * Generally used for combobox. This causes the hovered option element to be focused by the listbox.
     * @type {boolean}
     */
    this.focusOnHover = false

    this.attributeFilter = ["aria-current", "selected", "aria-selected", "role"]

    /**
     * Monitors its DOM for new nodes and assigns them to `this.options`
     * @type {MutationObserver}
     */
    this.optionObserver = new MutationObserver((mutations) => {
      for (const { attributeName } of mutations) {
        if (attributeName == null) continue

        if (this.attributeFilter.includes(attributeName)) {
          this.debounce(() => this.updateOptions(), { wait: 10, key: this.updateOptions })
        }

        // We really care about the mutations, we just need to know if things are updating.
        break;
      }
    })

    this.addEventListener("keydown", this.handleKeyDown)
    this.addEventListener("click", this.handleOptionClick)

    this.addEventListener("focusin", this.handleFocusIn)
  }

  /**
   * @override
   *
   */
  connectedCallback () {
    super.connectedCallback()

    this.debounce(() => this.updateOptions(), { wait: 10, key: this.updateOptions })

    /**
     * We only care about "role" attribute changes
     */
    this.optionObserver.observe(this, { subtree: true, childList: true, attributeFilter: this.attributeFilter })
  }

  /**
   * @override
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate (changedProperties) {
    if (changedProperties.has("role")) {
      changedProperties.set("role", "option")
      this.role = "listbox"
    }

    if (changedProperties.has("focusOnHover")) {
      if (this.focusOnHover) {
        this.addEventListener("pointermove", this.handleOptionClick)
      } else {
        this.removeEventListener("pointermove", this.handleOptionClick)
      }
    }

    if (changedProperties.has("multiSelect")) {
      if (this.multiSelect === true) {
        this.setAttribute("aria-multiselectable", "true")
      } else {
        this.removeAttribute("aria-multiselectable")
      }
    }

    if (changedProperties.has("currentActiveOption")) {
      const previousActiveOption = changedProperties.get("currentActiveOption")

      if (previousActiveOption) {
        this.removeFocus(previousActiveOption)

        if (!this.multiSelect) {
          if (this.currentActiveOption !== previousActiveOption) {
            this.deselect(previousActiveOption)
          }
        }
      }
    }

    super.willUpdate(changedProperties)
  }

  /**
   * @param {HTMLElement} option
   */
  setFocus (option) {
    option.setAttribute("aria-current", "true")
  }

  /**
   * @param {HTMLElement} option
   */
  removeFocus (option) {
    option.setAttribute("aria-current", "false")
  }

  /**
   * @type {HTMLElement | null | undefined}
   */
  get baseElement () {
    return this.shadowRoot?.querySelector("[part~='base']")
  }

  /**
   * @override
   * @type HTMLButtonElement["click"]
   */
  click() {
    const baseElement = this.baseElement

    if (baseElement) {
      baseElement.focus()
    }
  }

  /**
   * @override
   * @type HTMLButtonElement["focus"]
   */
  focus (options) {
    const baseElement = this.baseElement

    if (baseElement) {
      baseElement.focus(options)
    }
  }

  /**
   * @param {Event} evt
   */
  handleOptionClick (evt) {
    const path = evt.composedPath()

    const option = /** @type {HTMLElement | null} */ (path.find((el) => {
      return /** @type {HTMLElement} */ (el).getAttribute?.("role") === "option"
    }))

    if (!option) return

    this.currentActiveOption = option
    this.focusCurrent()

    if (this.multiSelect) {
      this.toggleSelected(option)
    }
  }

  get currentActiveOptionIndex () {
    return this.options.findIndex((el) => el === this.currentActiveOption)
  }

  /**
   * @param {KeyboardEvent} evt
   */
  handleKeyDown (evt) {
    const ctrlKeyPressed = evt.ctrlKey || (isMacOs() && evt.metaKey)
    const shiftKeyPressed = evt.shiftKey

    const handledKeys = {
      home: "Home",
      end: "End",
      arrowDown: "ArrowDown",
      arrowUp: "ArrowUp",
      space: " "
    }

    /**
     * Internal search buffer stuff
     */
    if (ctrlKeyPressed === false && shiftKeyPressed === false && evt.key.match(/^.$/)) {
      evt.preventDefault()

      if (this.multiSelect && this._searchBuffer === "" && evt.key === " ") {
        // Mark selected
        if (this.currentActiveOption) {
          this.toggleSelected(this.currentActiveOption)
        }
        return
      }

      this._searchBuffer += evt.key

      this.focusElementFromSearchBuffer()

      this.debounce(() => {
        this._searchBuffer = ""
      }, { wait: this.searchBufferDelay, key: this.handleKeyDown })
      return
    }

    if (this.multiSelect) {
      // Multi-select has slight different interactions so we need to check different key combos

      if (ctrlKeyPressed && shiftKeyPressed) {
        // CTRL + Shift + Home
        // Select from start -> focus
        if (evt.key === "Home") {
          evt.preventDefault()
          this.options.slice(0, this.currentActiveOptionIndex).forEach((opt) => {
            this.select(opt)
          })
          return
        }

        // CTRL + Shift + End
        // Select from focus -> end
        if (evt.key === "End") {
          evt.preventDefault()
          this.options.slice(this.currentActiveOptionIndex, this.options.length - 1).forEach((opt) => {
            this.select(opt)
          })
          return
        }
      }

      // CTRL + a || CTRL + A
      if (ctrlKeyPressed && evt.key.match(/^[aA]$/)) {
        evt.preventDefault()

        if (this.selectedOptions.length === this.options.length) {
          this.deselectAll()
        } else {
          this.selectAll()
        }
        return
      }


      if (shiftKeyPressed) {
        // Shift + Space. Selects from last selected item to currently focused item
        if (evt.key === " ") {

          /**
           * @type {HTMLElement | null}
           */
          let previousSelectedOption = null

          const options = this.options

          for (let i = options.length - 1; i > 0; i--) {
            const curr = options[i]

            if (this.isSelected(curr)) {
              previousSelectedOption = curr
              break;
            }
          }

          if (previousSelectedOption) {
            const previousSelectedIndex = options.findIndex((opt) => opt === previousSelectedOption)

            if (previousSelectedIndex >= 0) {
              evt.preventDefault()
              this.options.slice(previousSelectedIndex, this.currentActiveOptionIndex + 1).forEach((el) => {
                this.select(el)
              })
              return
            }
          }
        }
        // Shift + DownArrow
        if (evt.key === "ArrowDown") {
          this.focusNext()
          if (this.currentActiveOption) this.select(this.currentActiveOption)
          return
        }


        // Shift + UpArrow
        if (evt.key === "ArrowUp") {
          this.focusPrevious()
          if (this.currentActiveOption) this.select(this.currentActiveOption)
          return
        }
      }
    }

    if (Object.values(handledKeys).includes(evt.key)) {
      evt.preventDefault()
    }

    if (evt.key === "Home") {
      this.focusFirst()
      return
    }

    if (evt.key === "End") {
      this.focusLast()
      return
    }

    if (evt.key === "ArrowDown") {
      this.focusNext()
      return
    }

    if (evt.key === "ArrowUp") {
      this.focusPrevious()
      return
    }
  }

  focusElementFromSearchBuffer () {
    const searchBuffer = this._searchBuffer

    const matchedEl = this.options.find((el) => {
      // Native select only matches by case in-equal innerText.
      return el.innerText.toLowerCase().match(new RegExp("^" + searchBuffer))
    })

    if (matchedEl && this.currentActiveOption !== matchedEl) {
      this.currentActiveOption = matchedEl
      this.focusCurrent()
    }
  }

  /**
   * @param {HTMLElement} selectedElement
   */
  select (selectedElement) {
    this.selectedOptions = this.selectedOptions.concat(selectedElement)
    selectedElement.setAttribute("selected", "")

    // We don't want to override normal HTMLOptionElement semantics.
    if (!(selectedElement instanceof HTMLOptionElement)) {
      selectedElement.setAttribute("aria-selected", "true")
    }

    const event = new SelectedEvent("role-selected", { selectedElement })
    selectedElement.dispatchEvent(event)
  }

  /**
   * @param {HTMLElement} selectedElement
   */
  deselect (selectedElement) {
    selectedElement.removeAttribute("selected")
    selectedElement.setAttribute("aria-selected", "false")
  }

  /**
   * Mark every element with [aria-selected="true"]
   */
  selectAll () {
    for (const opt of this.options) {
      this.select(opt)
    }
  }

  /**
   * Mark every element with [aria-selected="false"]
   */
  deselectAll () {
    for (const opt of this.options) {
      this.deselect(opt)
    }
  }

  /**
   * @param {HTMLElement} selectedElement
   */
  toggleSelected (selectedElement) {
    if (this.isSelected(selectedElement)) {
      this.deselect(selectedElement)
      return
    }

    this.select(selectedElement)
  }

  focusCurrent () {
    const selectedElement = this.currentActiveOption

    if (!selectedElement) return

    // Common to both multi + single
    this.setAttribute("aria-activedescendant", selectedElement.getAttribute("id") || "")
    this.setFocus(selectedElement)

    if (!this.multiSelect) {
      this.select(selectedElement)
    }

    this.scrollOptionIntoView(selectedElement)
  }


  /**
   * @param {number} index
   */
  focusAt (index) {
    if (this.wrapSelection) {
      console.log("Wrap")
      index = wrap(0, index, this.options.length - 1)
    } else {
      index = clamp(0, index, this.options.length - 1)
    }

    this.currentActiveOption = this.options[index]
    this.focusCurrent()
  }

  focusNext () {
    this.focusAt(this.currentActiveOptionIndex + 1)
  }

  focusPrevious () {
    this.focusAt(this.currentActiveOptionIndex - 1)
  }

  focusFirst () {
    this.currentActiveOption = this.options[0]
    this.focusCurrent()
  }

  focusLast () {
    this.currentActiveOption = this.options[this.options.length - 1]
    this.focusCurrent()
  }

  /**
   * @param {HTMLElement} selectedOption
   * @return {void}
   */
  scrollOptionIntoView (selectedOption) {
    requestAnimationFrame(() => {
      selectedOption.scrollIntoView({ behavior: "auto", block: 'nearest'})
    });
  }

  /**
   * @param {FocusEvent} _evt
   */
  handleFocusIn (_evt) {
    // When a multi-select listbox receives focus:
    // If none of the options are selected before the listbox receives focus, focus is set on the first option and there is no automatic change in the selection state.
    // If one or more options are selected before the listbox receives focus, focus is set on the first option in the list that is selected.
    // When a single-select listbox receives focus:
    //
    //     If none of the options are selected before the listbox receives focus, the first option receives focus. Optionally, the first option may be automatically selected.
    //     If an option is selected before the listbox receives focus, focus is set on the selected option.
    //
    const firstSelectedOption = this.options.find((el) => this.isSelected(el))

    if (firstSelectedOption) {
      this.currentSelectedOption = firstSelectedOption
      this.focusCurrent()
      return
    }
  }

  handleFocusOut () {
  }

  /**
   * @param {HTMLElement} el
   * @return {boolean}
   */
  isSelected (el) {
    return el.getAttribute("aria-selected") === "true" || (el instanceof HTMLOptionElement && el.hasAttribute("selected"))
  }

  updateOptions () {
    this.options = /** @type {Array<HTMLElement>} */ Array.from(this.querySelectorAll("option, [role='option']"))

    this.selectedOptions = []
    const selectedOptions = this.selectedOptions

    if (this.options.length === 0) return

    this.options.forEach((el) => {
      // Sometimes people dont provide IDs, so we can fill it for them. We need ids for aria-activedescendant.
      // Because this lives in the lightDOM, we need to make sure we don't override existing ids.
      this.assignRandomId(el)

      if (this.isSelected(el)) {
        selectedOptions.push(el)
      }
    })

    const currentSelectedOption = selectedOptions[0]

    if (!this.multiSelect) {
      selectedOptions.forEach((optionEl) => {
        if (optionEl === currentSelectedOption) return

        this.removeFocus(optionEl)
        this.scrollOptionIntoView(optionEl)
        this.deselect(optionEl)
      })
      return
    }


    /**
     * @type {null | HTMLElement}
     */
    let currentActiveOption = null

    this.options.forEach((option) => {
      const isActiveOption = option.getAttribute("aria-current") === "true"
      if (!currentActiveOption && isActiveOption) {
        currentActiveOption = option
      }

      if (option !== currentActiveOption) {
        this.removeFocus(option)
      }
    })
  }

  /**
   * Users dont always provide ids on elements, and we need to make sure the id isn't already taken.
   * @param {HTMLElement} el
   */
  assignRandomId (el) {
    if (!el.hasAttribute("id")) {
      el.setAttribute("id", "role-listbox-option-" + uuidv4())
    }
  }

  render () {
    return html`
      <label class="visually-hidden" id="listbox-label">
        <slot name="label">
          ${this.label}
        </slot>
      </label>

      <div part="base" tabindex="1" role="region" aria-labelledby="listbox-label">
        <slot></slot>
      </div>
    `
  }
}