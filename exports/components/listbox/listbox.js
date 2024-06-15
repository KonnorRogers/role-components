// @ts-check

import { css, html } from "lit";
import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { wrap } from "../../../internal/wrap.js";
import { clamp } from "../../../internal/clamp.js";
import { uuidv4 } from "../../../internal/uuid.js";
import { SelectedEvent } from "../../events/selected-event.js";
import { isMacOs } from "../../../internal/is-mac-os.js";
import { LitFormAssociatedMixin } from "form-associated-helpers/exports/mixins/lit-form-associated-mixin.js";

/**
 * @typedef {{ from: number, to: number }} Range
 */

/**
 * @type {import("form-associated-helpers/exports/mixins/lit-form-associated-mixin.js").LitFormAssociatedMixin["formProperties"]}
 */
const formProperties = LitFormAssociatedMixin.formProperties

/**
 * A "combobox" is a `role="combobox"` that does allow editing its input. Currently, the only allowed combobox is one which has a "listbox" popup. Almost all elements except for the "anchored region" are in the light DOM for accessibility reasons.
 *   The currently hovered / focus `<role-option>` has `[aria-current="true"]`
 *   The currently selected `<role-option>` has `[aria-selected="true"]`
 *
 * @customElement
 * @tagname role-listbox
 */
export default class RoleListbox extends LitFormAssociatedMixin(BaseElement) {
  static baseName = "role-listbox";

  // static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true }

  static properties = {
    ...formProperties,
    // Attributes
    autocomplete: {},
    // Maps to aria-multiselectable
    multiple: { reflect: true, type: Boolean },
    length: {},

    label: { reflect: true },
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
    tabIndex: { reflect: true, attribute: "tabindex", type: Number }
  };

  static styles = [
    hostStyles,
    css`
      /* Split these up in case a selector isnt supported */
      :host(:focus-within) [part~="base"],
      :host(:focus-visible) [part~="base"] {
        outline: transparent;
        border-color: Canvas;
        box-shadow: 0px 0px 2px 3px SelectedItem;
      }

      :host {
        max-height: 100%;
        overflow: auto;
        scroll-behavior: smooth;
        border: 2px solid GrayText;
      }
    `,
  ];

  constructor() {
    super();

    /**
     * @type {null | FormData | string}
     */
    this.value = null

    /**
     * @type {HTMLElement[]}
     */
    this.selectedOptions = [];

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


    // Attributes
    this.autocomplete = "off"
    // Maps to aria-multiselectable
    this.multiple = false

    /**
     * @type {number}
     */
    this.tabIndex = 0

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
     * Delay before the search buffer returns to an empty string
     * @type {number}
     */
    this.searchBufferDelay = 1000;

    /**
     * @type {HTMLElement[]}
     */
    this.options = [];

    /**
     * @type {null | HTMLElement}
     */
    this.currentOption = null;

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
        }

        // We really care about the mutations, we just need to know if things are updating.
        break;
      }
    });

    this.addEventListener("keydown", this.eventHandler.get(this.handleKeyDown));
    this.addEventListener("click", this.eventHandler.get(this.handleOptionClick));
    this.addEventListener("pointermove", this.eventHandler.get(this.handleOptionHover))
    this.addEventListener("focusin", this.eventHandler.get(this.handleFocusIn));
  }

  // click () {
  //   this.focus()
  // }

  /**
   * @override
   *
   */
  connectedCallback() {
    super.connectedCallback();

    this.updateOptions()
    this.updateComplete.then(() => this.updateOptions())

    /**
     * We only care about "role" attribute changes
     */
    this.optionObserver.observe(this, {
      subtree: true,
      childList: true,
      attributeFilter: this.attributeFilter,
    });
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

  /**
   * @override
   * @param {import("lit").PropertyValues<this>} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has("role")) {
      this.role = "listbox";
      this.setAttribute("role", "listbox")
    }


    if (changedProperties.has("selectedOptions")) {
      this.setAttribute("aria-setsize", (this.selectedOptions.length).toString())
      this.setAttribute("aria-posinset", (0).toString())
    }

    if (changedProperties.has("multiple")) {
      if (this.multiple === true) {
        this.setAttribute("aria-multiselectable", "true");
      } else {
        this.removeAttribute("aria-multiselectable");
      }
    }

    if (changedProperties.has("currentOption")) {
      const previousActiveOption = changedProperties.get("currentOption");

      if (this.currentOption !== previousActiveOption) {
        if (previousActiveOption) {
          this.removeFocus(previousActiveOption);

          if (!this.multiple) {
            this.deselect(previousActiveOption);
          }
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
    option.removeAttribute("aria-current");
    /** @type {import("../option/option.js").default} */ (option).current = false;
  }

  /**
   * @type {HTMLElement | null | undefined}
   */
  get baseElement() {
    return this
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

    this.currentOption = option;

    if (this.multiple) {
      if (evt.shiftKey) {
        this.selectFromRangeStartToCurrent()
      } else {
        this.toggleSelected(option);
      }
    }

    this.focusCurrent();
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
        if (evt.key === " ") {
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

  focusElementFromSearchBuffer() {
    const searchBuffer = this._searchBuffer;

    const regex = new RegExp("^" + searchBuffer.replaceAll(/\\/g, "\\\\").toLowerCase())

    const matchedEl = this.options.find((el) => {
      // Native select only matches by case in-equal innerText.
      return el.innerText.toLowerCase().match(regex);
    });

    if (matchedEl && this.currentOption !== matchedEl) {
      this.currentOption = matchedEl;
      this.focusCurrent();
    }
  }

  /**
   * @param {HTMLElement} element
   */
  select(element) {
    const selectedElement = /** @type {import("../option/option.js").default} */ (element)
    this.selectedOptions = this.selectedOptions.concat(selectedElement);
    selectedElement.selected = true;

    // We don't want to override normal HTMLOptionElement semantics.
    if (!(selectedElement instanceof HTMLOptionElement)) {
      selectedElement.setAttribute("aria-selected", "true");
    }

    this.debounce(() => this.updateOptions(), {
      key: this.updateOptions,
      wait: 1
    })

    const event = new SelectedEvent("role-selected", { selectedElement });
    selectedElement.dispatchEvent(event);
  }

  /**
   * @param {HTMLElement} element
   */
  deselect(element) {
    const selectedElement = /** @type {import("../option/option.js").default} */ (element)
    selectedElement.selected = false;
    // selectedElement.removeAttribute("aria-selected");

    const event = new SelectedEvent("role-deselected", { selectedElement });
    selectedElement.dispatchEvent(event);

    this.debounce(() => this.updateOptions(), {
      wait: 1,
      key: this.updateOptions,
    });
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

    if (!selectedElement) return;

    // Common to both multi + single
    this.setAttribute(
      "aria-activedescendant",
      selectedElement.getAttribute("id") || "",
    );

    this.setFocus(selectedElement);

    if (!this.multiple) {
      this.deselectAll()
      this.select(selectedElement);
    }

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

    this.currentOption = this.options[index];
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
    if (this.matches(":focus-within")) {
      selectedOption.scrollIntoView({ block: "nearest" });
    }
  }

  /**
   * @param {FocusEvent} _evt
   */
  handleFocusIn(_evt) {
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
    const baseElement = this.baseElement
    if (!baseElement) return

    this.options = /** @type {Array<HTMLElement>} */ Array.from(
      baseElement.querySelectorAll("option, [role='option']"),
    );

    this.selectedOptions = [];
    const selectedOptions = this.selectedOptions;

    if (this.options.length === 0) return;

    let hasSelected = false
    const multipleFormData = new FormData()

    this.options.forEach((el) => {
      // Sometimes people dont provide IDs, so we can fill it for them. We need ids for aria-activedescendant.
      // Because this lives in the lightDOM, we need to make sure we don't override existing ids.
      this.assignRandomId(el);

      if (this.isSelected(el)) {
        selectedOptions.push(el);

        const value = /** @type {HTMLOptionElement} */ (el).value || el.innerText
        if (!hasSelected) {
          if (!this.multiple) {
            this.value = value
          }
          this.currentOption = el
          hasSelected = true
        }

        if (this.multiple && this.name) {
          multipleFormData.append(this.name, value)
        }
      }
    });

    const currentSelectedOption = selectedOptions[0];

    if (!this.multiple) {
      if (currentSelectedOption) {
        this.scrollOptionIntoView(currentSelectedOption)
      }

      selectedOptions.forEach((optionEl) => {
        if (optionEl === currentSelectedOption) {
          return;
        }

        this.removeFocus(optionEl);
        this.deselect(optionEl);
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

  /**
   * Users dont always provide ids on elements, and we need to make sure the id isn't already taken.
   * @param {HTMLElement} el
   */
  assignRandomId(el) {
    if (!el.hasAttribute("id")) {
      el.setAttribute("id", "role-listbox-option-" + uuidv4());
    }
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}
