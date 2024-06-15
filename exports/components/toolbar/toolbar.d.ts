/**
 * A toolbar following the W3C Toolbar pattern.
 * <https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/>
 * @customElement
 * @tagname role-toolbar
 */
export default class RoleToolbar extends BaseElement {
    static properties: {
        orientation: {
            reflect: boolean;
        };
        ariaOrientation: {
            reflect: boolean;
        };
        _currentFocusIndex: {
            state: boolean;
        };
        _toolbarItems: {
            state: boolean;
        };
    };
    /** @returns {string} */
    static get baseName(): string;
    static get styles(): import("lit").CSSResult[];
    constructor();
    /**
     * @type {number}
     */
    _currentFocusIndex: number;
    /**
     * @type {"vertical" | "horizontal"}
     */
    orientation: "vertical" | "horizontal";
    /** @type Array<Element> */
    _toolbarItems: Array<Element>;
    /**
     * @param {import("lit").PropertyValues<this>} changedProperties
     */
    willUpdate(changedProperties: import("lit").PropertyValues<this>): void;
    /**
     * @return {Record<string, (event: Event) => void>}
     */
    get keydownHandlers(): Record<string, (event: Event) => void>;
    _keydownHandlers: {
        arrowleft: (_event: Event) => void;
        arrowup: (_event: Event) => void;
        arrowright: (_event: Event) => void;
        arrowdown: (_event: Event) => void;
        home: () => void;
        end: () => void;
    } | undefined;
    render(): import("lit").TemplateResult<1>;
    /** @param {Event} event */
    handleClick(event: Event): void;
    /** @param {KeyboardEvent} event */
    handleKeyDown(event: KeyboardEvent): void;
    /** @param {Event} _event */
    focusNext(_event: Event): void;
    /** @param {Event} _event */
    focusPrevious(_event: Event): void;
    focusFirst(): void;
    focusLast(): void;
    setTabIndex({ focus }?: {
        focus?: boolean | undefined;
    }): void;
    get currentFocusElement(): Element | undefined;
    /**
     * @param {undefined | null | Event} [evt] - triggered by a slot change event.
     */
    updateToolbarItems(evt?: undefined | null | Event): void;
}
import { BaseElement } from "../../../internal/base-element.js";
