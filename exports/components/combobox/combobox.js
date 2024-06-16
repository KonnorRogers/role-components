import { LitElement } from "lit";
import RoleSelect from "../select/select.js";

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
 * @customElement
 * @tagname role-combobox
 * @status experimental
 * @since 3.0
 */
export default class RoleCombobox extends RoleSelect {
  static baseName = "role-combobox";
  static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true }

  constructor () {
    super()
    this.editable = true
  }
}
