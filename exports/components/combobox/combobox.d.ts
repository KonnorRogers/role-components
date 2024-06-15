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
 */
export default class RoleCombobox extends RoleSelect {
}
export type OptionObject = {
    /**
     * - Unique identifier
     */
    id: string | null;
    /**
     * - Text content
     */
    content: string;
    /**
     * - The "value" to be submitted by the form.
     */
    value: string;
    /**
     * - If it is the currently "focused" option
     */
    current: boolean;
    /**
     * - Whether or not the option is selected.
     */
    selected: boolean;
    /**
     * - Whether or not the option is part of autocomplete.
     */
    focusable: boolean;
};
export type RoleOption = import("../option/option.js").default;
export type Range = {
    from: number;
    to: number;
};
import RoleSelect from "../select/select.js";
