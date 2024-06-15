/**
 * @customElement
 * @tagname role-option-group
 */
export default class OptionGroup extends BaseElement {
    static properties: {
        role: {
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult[];
    constructor();
    role: string;
    /**
     * @param {import("lit").PropertyValues<this>} changedProperties
     */
    willUpdate(changedProperties: import("lit").PropertyValues<this>): void;
    render(): import("lit").TemplateResult<1>;
}
import { BaseElement } from "../../../internal/base-element.js";
